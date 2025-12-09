import { HabitCard } from '@/components/habits/HabitCard';
import { ProgressBar } from '@/components/habits/ProgressBar';
import { PointsBadge } from '@/components/rewards/PointsBadge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDate, getToday } from '@/utils/dateHelpers';
import { isCompletedToday, isHabitDueToday } from '@/utils/habitHelpers';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { habits, toggleHabitCompletion, refreshData, loading } = useHabits();
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Filter habits that are due today
  const todayHabits = habits.filter(habit => isHabitDueToday(habit));
  const completedCount = todayHabits.filter(habit => isCompletedToday(habit.history)).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              {getGreeting()}, {user?.name?.split(' ')[0] || 'bạn'}!
            </ThemedText>
            <Text style={styles.date}>{formatDate(getToday(), 'EEEE, MMMM dd')}</Text>
          </View>
          {user && <PointsBadge points={user.points} size="medium" showLabel={false} />}
        </View>

        {/* Progress Section */}
        {todayHabits.length > 0 && (
          <View style={styles.progressSection}>
            <ProgressBar completed={completedCount} total={todayHabits.length} />
          </View>
        )}

        {/* Today's Habits */}
        <View style={styles.habitsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Today's Habits
          </ThemedText>

          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <ThemedText style={styles.emptyText}>
                No habits for today
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Tap the + button to create your first habit
              </ThemedText>
            </View>
          ) : (
            todayHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={() => toggleHabitCompletion(habit.id)}
                onPress={() => router.push(`/habit/${habit.id}`)}
              />
            ))
          )}
        </View>

        {/* All Habits Section */}
        {habits.length > todayHabits.length && (
          <View style={styles.habitsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Other Habits
            </ThemedText>
            {habits
              .filter(habit => !isHabitDueToday(habit))
              .map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleHabitCompletion(habit.id)}
                  onPress={() => router.push(`/habit/${habit.id}`)}
                />
              ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
        onPress={() => router.push('/habit/create')}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  progressSection: {
    marginBottom: 24,
  },
  habitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
