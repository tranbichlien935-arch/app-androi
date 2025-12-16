import { STORAGE_KEYS } from '@/types/habit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * User Storage
 */
export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

export const loadUser = async () => {
    try {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error loading user:', error);
        return null;
    }
};

export const clearUser = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error('Error clearing user:', error);
        throw error;
    }
};

/**
 * Habits Storage
 */
export const saveHabits = async (habits) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
        console.error('Error saving habits:', error);
        throw error;
    }
};

export const loadHabits = async () => {
    try {
        const habitsData = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
        return habitsData ? JSON.parse(habitsData) : [];
    } catch (error) {
        console.error('Error loading habits:', error);
        return [];
    }
};

/**
 * Achievements Storage
 */
export const saveAchievements = async (achievements) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
        console.error('Error saving achievements:', error);
        throw error;
    }
};

export const loadAchievements = async () => {
    try {
        const achievementsData = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        return achievementsData ? JSON.parse(achievementsData) : [];
    } catch (error) {
        console.error('Error loading achievements:', error);
        return [];
    }
};

/**
 * Update user points
 */
export const updateUserPoints = async (points, level) => {
    try {
        const user = await loadUser();
        if (user) {
            user.points = points;
            user.level = level;
            await saveUser(user);
        }
    } catch (error) {
        console.error('Error updating user points:', error);
        throw error;
    }
};

/**
 * Backup & Restore
 */
export const exportData = async () => {
    try {
        const user = await loadUser();
        const habits = await loadHabits();
        const achievements = await loadAchievements();

        return {
            user,
            habits,
            achievements,
            exportDate: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
};

export const importData = async (data) => {
    try {
        if (data.user) {
            await saveUser(data.user);
        }
        if (data.habits) {
            await saveHabits(data.habits);
        }
        if (data.achievements) {
            await saveAchievements(data.achievements);
        }
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
};

/**
 * Clear all data
 */
export const clearAllData = async () => {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.USER,
            STORAGE_KEYS.HABITS,
            STORAGE_KEYS.ACHIEVEMENTS,
        ]);
    } catch (error) {
        console.error('Error clearing all data:', error);
        throw error;
    }
};
