import { useThemeColor } from '@/hooks/use-theme-color';
import { Achievement } from '@/types/habit';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AchievementCard = ({ achievement }) => {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={[
            styles.container,
            { backgroundColor },
            !achievement.unlocked && styles.locked,
        ]}>
            <View style={styles.iconContainer}>
                <Text style={[
                    styles.icon,
                    !achievement.unlocked && styles.lockedIcon,
                ]}>
                    {achievement.icon}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[
                    styles.title,
                    { color: textColor },
                    !achievement.unlocked && styles.lockedText,
                ]}>
                    {achievement.title}
                </Text>
                <Text style={[
                    styles.description,
                    !achievement.unlocked && styles.lockedText,
                ]}>
                    {achievement.description}
                </Text>

                {achievement.unlocked && achievement.unlockedAt && (
                    <Text style={styles.unlockedDate}>
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </Text>
                )}
            </View>

            {achievement.unlocked && (
                <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    locked: {
        opacity: 0.5,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 32,
    },
    lockedIcon: {
        opacity: 0.3,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
    },
    lockedText: {
        opacity: 0.6,
    },
    unlockedDate: {
        fontSize: 12,
        color: '#10b981',
        marginTop: 4,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10b981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkIcon: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

