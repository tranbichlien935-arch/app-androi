import { useThemeColor } from '@/hooks/use-theme-color';
import { Habit } from '@/types/habit';
import { formatTime } from '@/utils/dateHelpers';
import { getHabitStats, isCompletedToday } from '@/utils/habitHelpers';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

export const HabitCard = ({ habit, onToggle, onPress }) => {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const stats = getHabitStats(habit);
    const isCompleted = isCompletedToday(habit.history);

    const scale = useSharedValue(1);
    const checkScale = useSharedValue(isCompleted ? 1 : 0);

    useEffect(() => {
        checkScale.value = withSpring(isCompleted ? 1 : 0);
    }, [isCompleted]);

    const animatedCheckStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        scale.value = withSequence(
            withSpring(0.95),
            withSpring(1)
        );

        onToggle();
    };

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={[styles.card, { backgroundColor }]}>
                <TouchableOpacity
                    onPress={handleToggle}
                    style={[
                        styles.checkbox,
                        isCompleted && { backgroundColor: tintColor, borderColor: tintColor },
                    ]}
                >
                    <Animated.View style={animatedCheckStyle}>
                        {isCompleted && <Feather name="check" size={18} color="#fff" />}
                    </Animated.View>
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.habitName, { color: textColor }]} numberOfLines={1}>
                            {habit.name}
                        </Text>
                        {stats.currentStreak > 0 && (
                            <View style={styles.streakBadge}>
                                <Text style={styles.fireIcon}>🔥</Text>
                                <Text style={styles.streakText}>{stats.currentStreak}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        {habit.reminderTime && (
                            <View style={styles.reminderContainer}>
                                <Feather name="clock" size={12} color="#94a3b8" />
                                <Text style={styles.reminderText}>{formatTime(habit.reminderTime)}</Text>
                            </View>
                        )}

                        <Text style={styles.frequencyText}>
                            {habit.frequency === 'daily' ? 'Daily' : `${habit.selectedDays?.length || 0} days/week`}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#cbd5e1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    fireIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    streakText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#d97706',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reminderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reminderText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    frequencyText: {
        fontSize: 12,
        color: '#94a3b8',
    },
});

