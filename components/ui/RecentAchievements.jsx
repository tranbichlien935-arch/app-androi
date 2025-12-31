import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecentAchievements({ achievements = [], onViewAll }) {
    // Default achievements if none provided
    const defaultAchievements = [
        {
            id: 1,
            icon: '🏆',
            title: 'Đạt 10,000 bước',
            subtitle: 'Hôm nay',
            color: '#fbbf24',
            bgColor: '#fef3c7',
        },
        {
            id: 2,
            icon: '💧',
            title: 'Hoàn thành mục tiêu nước',
            subtitle: 'Hôm nay',
            color: '#06b6d4',
            bgColor: '#cffafe',
        },
    ];

    const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Thành tích gần đây</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <View style={styles.viewAllButton}>
                        <Text style={styles.viewAllText}>Xem tất cả</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.purple[600]} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.achievementsList}>
                {displayAchievements.slice(0, 3).map((achievement) => (
                    <View
                        key={achievement.id}
                        style={[styles.achievementCard, { backgroundColor: achievement.bgColor }]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: achievement.color }]}>
                            <Text style={styles.iconText}>{achievement.icon}</Text>
                        </View>
                        <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        marginTop: 0,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        color: Colors.purple[600],
        fontWeight: '500',
    },
    achievementsList: {
        gap: 12,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 2,
    },
    achievementSubtitle: {
        fontSize: 12,
        color: Colors.gray[600],
    },
});
