import { ACHIEVEMENT_DEFINITIONS } from '@/constants/habits';
import { getToday } from '@/utils/dateHelpers';
import { calculatePoints, getHabitStats, isCompletedToday } from '@/utils/habitHelpers';
import { cancelHabitNotifications, scheduleHabitReminder } from '@/utils/notifications';
import { loadAchievements, loadHabits, saveAchievements, saveHabits } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const HabitContext = createContext(undefined);

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabits must be used within HabitProvider');
    }
    return context;
};

export const HabitProvider = ({ children }) => {
    const { user, updateUserPoints } = useAuth();
    const [habits, setHabits] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        try {
            const [loadedHabits, loadedAchievements] = await Promise.all([
                loadHabits(),
                loadAchievements(),
            ]);

            // Filter habits for current user
            const userHabits = loadedHabits.filter(h => h.userId === user?.id);
            setHabits(userHabits);

            // Initialize achievements if empty
            if (loadedAchievements.length === 0) {
                const initialAchievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
                    ...def,
                    unlocked: false,
                }));
                setAchievements(initialAchievements);
                await saveAchievements(initialAchievements);
            } else {
                setAchievements(loadedAchievements);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        await loadData();
    };

    const checkAndUnlockAchievements = async (updatedHabits) => {
        if (!user) return;

        const updatedAchievements = [...achievements];
        let hasChanges = false;

        for (const achievement of updatedAchievements) {
            if (achievement.unlocked) continue;

            let shouldUnlock = false;

            if (achievement.type === 'total') {
                // Total habits created
                if (updatedHabits.length >= achievement.requirement) {
                    shouldUnlock = true;
                }
            } else if (achievement.type === 'streak') {
                // Check if any habit has required streak
                const maxStreak = Math.max(...updatedHabits.map(h => getHabitStats(h).currentStreak));
                if (maxStreak >= achievement.requirement) {
                    shouldUnlock = true;
                }
            } else if (achievement.type === 'perfect_week') {
                // Check if all habits completed for 7 days
                let perfectDays = 0;

                for (let i = 0; i < 7; i++) {
                    const checkDate = new Date();
                    checkDate.setDate(checkDate.getDate() - i);
                    const dateStr = checkDate.toISOString().split('T')[0];

                    const allCompleted = updatedHabits.every(h => h.history.includes(dateStr));
                    if (allCompleted) {
                        perfectDays++;
                    } else {
                        break;
                    }
                }

                if (perfectDays >= achievement.requirement) {
                    shouldUnlock = true;
                }
            }

            if (shouldUnlock) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                hasChanges = true;
            }
        }

        if (hasChanges) {
            setAchievements(updatedAchievements);
            await saveAchievements(updatedAchievements);
        }
    };

    const addHabit = async (habitData) => {
        if (!user) return;

        try {
            const newHabit = {
                ...habitData,
                id: Date.now().toString(),
                userId: user.id,
                createdAt: getToday(),
                history: [],
            };

            const updatedHabits = [...habits, newHabit];
            setHabits(updatedHabits);
            await saveHabits(updatedHabits);

            // Schedule notification if reminder time is set
            if (newHabit.reminderTime) {
                await scheduleHabitReminder(newHabit);
            }

            // Check achievements
            await checkAndUnlockAchievements(updatedHabits);
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    const updateHabit = async (id, updates) => {
        try {
            const updatedHabits = habits.map(h =>
                h.id === id ? { ...h, ...updates } : h
            );

            setHabits(updatedHabits);
            await saveHabits(updatedHabits);

            // Update notification if reminder time changed
            const habit = updatedHabits.find(h => h.id === id);
            if (habit && updates.reminderTime !== undefined) {
                await cancelHabitNotifications(id);
                if (updates.reminderTime) {
                    await scheduleHabitReminder(habit);
                }
            }
        } catch (error) {
            console.error('Error updating habit:', error);
        }
    };

    const deleteHabit = async (id) => {
        try {
            const updatedHabits = habits.filter(h => h.id !== id);
            setHabits(updatedHabits);
            await saveHabits(updatedHabits);

            // Cancel notifications
            await cancelHabitNotifications(id);
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const toggleHabitCompletion = async (id) => {
        if (!user) return;

        try {
            const today = getToday();
            const habit = habits.find(h => h.id === id);
            if (!habit) return;

            const isCompleted = isCompletedToday(habit.history);
            let updatedHistory;
            let pointsChange = 0;

            if (isCompleted) {
                // Remove today from history
                updatedHistory = habit.history.filter(date => date !== today);
            } else {
                // Add today to history
                updatedHistory = [...habit.history, today].sort();

                // Calculate points
                const stats = getHabitStats({ ...habit, history: updatedHistory });
                pointsChange = calculatePoints(stats.currentStreak);
            }

            const updatedHabits = habits.map(h =>
                h.id === id ? { ...h, history: updatedHistory } : h
            );

            setHabits(updatedHabits);
            await saveHabits(updatedHabits);

            // Update user points
            if (pointsChange > 0) {
                const newPoints = user.points + pointsChange;
                await updateUserPoints(newPoints);
            }

            // Check achievements
            await checkAndUnlockAchievements(updatedHabits);
        } catch (error) {
            console.error('Error toggling habit completion:', error);
        }
    };

    const value = {
        habits,
        achievements,
        loading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        refreshData,
    };

    return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
