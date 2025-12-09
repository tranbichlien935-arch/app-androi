import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Notification permissions not granted');
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('habit-reminders', {
                name: 'Habit Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#2563eb',
            });
        }

        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
};

/**
 * Schedule daily reminder for a habit
 */
export const scheduleHabitReminder = async (habit) => {
    try {
        if (!habit.reminderTime) return null;

        const [hours, minutes] = habit.reminderTime.split(':').map(Number);

        const trigger = {
            hour: hours,
            minute: minutes,
            repeats: true,
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Habit Reminder 🔔',
                body: `Time to complete: ${habit.name}`,
                data: { habitId: habit.id },
                sound: true,
            },
            trigger,
        });

        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
};

/**
 * Cancel notification by ID
 */
export const cancelNotification = async (notificationId) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error('Error canceling notification:', error);
    }
};

/**
 * Cancel all notifications for a habit
 */
export const cancelHabitNotifications = async (habitId) => {
    try {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

        for (const notification of scheduledNotifications) {
            if (notification.content.data?.habitId === habitId) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
    } catch (error) {
        console.error('Error canceling habit notifications:', error);
    }
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async () => {
    try {
        return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
        console.error('Error getting scheduled notifications:', error);
        return [];
    }
};
