import { AchievementCard } from '@/components/rewards/AchievementCard';
import { PointsBadge } from '@/components/rewards/PointsBadge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LEVEL_THRESHOLDS } from '@/constants/habits';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RewardsScreen() {
    const { user } = useAuth();
    const { achievements } = useHabits();
    const tintColor = useThemeColor({}, 'tint');

    if (!user) return null;

    const currentLevel = LEVEL_THRESHOLDS.find(l => l.level === user.level);
    const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === user.level + 1);
    const progress = nextLevel
        ? ((user.points - (currentLevel?.points || 0)) / (nextLevel.points - (currentLevel?.points || 0))) * 100
        : 100;

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ThemedText type="title" style={styles.pageTitle}>
                    Rewards
                </ThemedText>

                {/* Points & Level Card */}
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <PointsBadge points={user.points} size="large" showLabel={true} />
                        <View style={styles.levelInfo}>
                            <Text style={styles.levelTitle}>Level {user.level}</Text>
                            <Text style={styles.levelSubtitle}>{currentLevel?.title}</Text>
                        </View>
                    </View>

                    {nextLevel && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#2563eb' }]} />
                            </View>
                            <Text style={styles.progressText}>
                                {nextLevel.points - user.points} points to Level {nextLevel.level}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Achievements */}
                <View style={styles.achievementsSection}>
                    <View style={styles.sectionHeader}>
                        <ThemedText type="subtitle">Achievements</ThemedText>
                        <Text style={styles.achievementCount}>
                            {unlockedCount}/{achievements.length}
                        </Text>
                    </View>

                    {achievements.map(achievement => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </View>
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
    levelCard: {
        backgroundColor: '#eff6ff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
    },
    levelSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
    progressContainer: {
        gap: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#dbeafe',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    achievementsSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    achievementCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
});
