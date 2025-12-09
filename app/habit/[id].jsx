import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabits } from '@/contexts/HabitContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatTime } from '@/utils/dateHelpers';
import { getHabitStats } from '@/utils/habitHelpers';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { habits, deleteHabit } = useHabits();
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');

    const habit = habits.find(h => h.id === id);

    if (!habit) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Habit not found</ThemedText>
            </ThemedView>
        );
    }

    const stats = getHabitStats(habit);

    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteHabit(habit.id);
                        router.back();
                    },
                },
            ]
        );
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.habitName}>
                        {habit.name}
                    </ThemedText>
                    <View style={styles.headerInfo}>
                        <Text style={styles.frequency}>
                            {habit.frequency === 'daily' ? 'Daily' : `${habit.selectedDays?.length || 0} days/week`}
                        </Text>
                        {habit.reminderTime && (
                            <View style={styles.reminderBadge}>
                                <Feather name="clock" size={14} color={tintColor} />
                                <Text style={[styles.reminderText, { color: tintColor }]}>
                                    {formatTime(habit.reminderTime)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Statistics Cards */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statValue}>{stats.currentStreak}</Text>
                        <Text style={styles.statLabel}>Current Streak</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
                        <Text style={styles.statIcon}>🏆</Text>
                        <Text style={styles.statValue}>{stats.longestStreak}</Text>
                        <Text style={styles.statLabel}>Longest Streak</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
                        <Text style={styles.statIcon}>✅</Text>
                        <Text style={styles.statValue}>{stats.totalCompletions}</Text>
                        <Text style={styles.statLabel}>Total Completions</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#fce7f3' }]}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={styles.statValue}>{stats.completionRate}%</Text>
                        <Text style={styles.statLabel}>Completion Rate</Text>
                    </View>
                </View>

                {/* Recent History */}
                <View style={styles.historySection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Recent Activity
                    </ThemedText>
                    {habit.history.length === 0 ? (
                        <Text style={styles.emptyText}>No activity yet</Text>
                    ) : (
                        <View style={styles.historyList}>
                            {habit.history
                                .slice(-10)
                                .reverse()
                                .map((date, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <Feather name="check-circle" size={20} color="#10b981" />
                                        <Text style={[styles.historyDate, { color: textColor }]}>
                                            {new Date(date).toLocaleDateString('vi-VN', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>

                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Feather name="trash-2" size={20} color="#ef4444" />
                    <Text style={styles.deleteButtonText}>Delete Habit</Text>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    habitName: {
        marginBottom: 8,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    frequency: {
        fontSize: 14,
        color: '#64748b',
    },
    reminderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#eff6ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    reminderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    historySection: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    historyList: {
        gap: 12,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '500',
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        paddingVertical: 24,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fecaca',
        backgroundColor: '#fef2f2',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});
