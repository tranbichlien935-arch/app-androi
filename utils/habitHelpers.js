import { POINTS_PER_COMPLETION, STREAK_BONUS_MULTIPLIER } from '@/constants/habits';
import { getDayOfWeek, getDaysBetween, getToday } from './dateHelpers';

/**
 * Calculate current streak from history array
 * Returns number of consecutive days from today backwards
 */
export const calculateStreak = (history) => {
    if (!history || history.length === 0) return 0;

    // Sort history in descending order (newest first)
    const sortedHistory = [...history].sort((a, b) => b.localeCompare(a));

    const today = getToday();
    let streak = 0;

    // Check if completed today or yesterday to start counting
    if (sortedHistory[0] !== today && getDaysBetween(sortedHistory[0], today) > 1) {
        return 0; // Streak broken
    }

    // Start from today or the most recent completion
    let checkDate = sortedHistory[0] === today ? today : sortedHistory[0];

    for (const date of sortedHistory) {
        const daysDiff = getDaysBetween(date, checkDate);

        if (daysDiff === 0) {
            streak++;
            continue;
        } else if (daysDiff === 1) {
            streak++;
            checkDate = date;
        } else {
            break; // Streak broken
        }
    }

    return streak;
};

/**
 * Find longest streak in history
 */
export const getLongestStreak = (history) => {
    if (!history || history.length === 0) return 0;

    const sortedHistory = [...history].sort();
    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedHistory.length; i++) {
        const daysDiff = getDaysBetween(sortedHistory[i - 1], sortedHistory[i]);

        if (daysDiff === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }

    return longestStreak;
};

/**
 * Calculate completion rate
 */
export const getCompletionRate = (history, totalDays) => {
    if (totalDays === 0) return 0;
    return Math.round((history.length / totalDays) * 100);
};

/**
 * Check if habit is due today based on frequency
 */
export const isHabitDueToday = (habit) => {
    if (habit.frequency === 'daily') {
        return true;
    }

    if (habit.frequency === 'weekly' && habit.selectedDays) {
        const today = getDayOfWeek();
        return habit.selectedDays.includes(today);
    }

    return false;
};

/**
 * Check if habit is completed today
 */
export const isCompletedToday = (history) => {
    const today = getToday();
    return history.includes(today);
};

/**
 * Calculate points earned for a completion
 */
export const calculatePoints = (streak) => {
    let points = POINTS_PER_COMPLETION;

    // Apply streak bonus if streak >= 7
    if (streak >= 7) {
        points = Math.round(points * STREAK_BONUS_MULTIPLIER);
    }

    return points;
};

/**
 * Get habit statistics
 */
export const getHabitStats = (habit) => {
    const currentStreak = calculateStreak(habit.history);
    const longestStreak = getLongestStreak(habit.history);
    const daysSinceCreation = getDaysBetween(habit.createdAt, getToday()) + 1;
    const completionRate = getCompletionRate(habit.history, daysSinceCreation);

    return {
        currentStreak,
        longestStreak,
        completionRate,
        totalCompletions: habit.history.length,
    };
};

/**
 * Format streak display text
 */
export const formatStreak = (days) => {
    if (days === 0) return 'No streak';
    if (days === 1) return '1 day';
    return `${days} days`;
};

/**
 * Get completion count for a specific date range
 */
export const getCompletionsInRange = (history, startDate, endDate) => {
    return history.filter(date => date >= startDate && date <= endDate).length;
};
