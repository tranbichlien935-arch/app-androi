import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { WeeklyHeatmap } from '@/components/charts/WeeklyHeatmap';
import { StreakCounter } from '@/components/habits/StreakCounter';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabits } from '@/contexts/HabitContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getWeekDates } from '@/utils/dateHelpers';
import { getHabitStats } from '@/utils/habitHelpers';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StatisticsScreen() {
  const { habits } = useHabits();
  const textColor = useThemeColor({}, 'text');

  // Calculate overall stats
  const overallStats = useMemo(() => {
    if (habits.length === 0) {
      return { totalCompletions: 0, avgCompletionRate: 0, maxStreak: 0 };
    }

    const totalCompletions = habits.reduce((sum, h) => sum + h.history.length, 0);
    const avgCompletionRate = Math.round(
      habits.reduce((sum, h) => sum + getHabitStats(h).completionRate, 0) / habits.length
    );
    const maxStreak = Math.max(...habits.map(h => getHabitStats(h).currentStreak));

    return { totalCompletions, avgCompletionRate, maxStreak };
  }, [habits]);

  // Calculate weekly heatmap data
  const weeklyData = useMemo(() => {
    const weekDates = getWeekDates();
    const completionData = {};

    weekDates.forEach(date => {
      completionData[date] = habits.filter(h => h.history.includes(date)).length;
    });

    return completionData;
  }, [habits]);

  // Get top 3 habits by streak
  const topHabits = useMemo(() => {
    return habits
      .map(h => ({ habit: h, streak: getHabitStats(h).currentStreak }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);
  }, [habits]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.pageTitle}>
          Statistics
        </ThemedText>

        {/* Overall Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.statValue}>{overallStats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Total Completions</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.statValue}>{overallStats.avgCompletionRate}%</Text>
            <Text style={styles.statLabel}>Avg Completion</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Text style={styles.statValue}>{overallStats.maxStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Weekly Heatmap */}
        <WeeklyHeatmap completionData={weeklyData} />

        {/* Comparison Chart */}
        <ComparisonChart habits={habits} />

        {/* Top Habits */}
        {topHabits.length > 0 && (
          <View style={styles.topHabitsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Top Streaks
            </ThemedText>
            {topHabits.map(({ habit, streak }, index) => (
              <View key={habit.id} style={styles.topHabitItem}>
                <View style={styles.topHabitRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.topHabitInfo}>
                  <Text style={[styles.topHabitName, { color: textColor }]}>
                    {habit.name}
                  </Text>
                </View>
                <StreakCounter streak={streak} size="small" />
              </View>
            ))}
          </View>
        )}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <ThemedText style={styles.emptyText}>
              No data yet
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Create habits and track them to see statistics
            </ThemedText>
          </View>
        )}
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
  pageTitle: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  topHabitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  topHabitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  topHabitRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  topHabitInfo: {
    flex: 1,
  },
  topHabitName: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
