import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Component hiển thị thống kê trung bình tuần
 * @param {Object} props
 * @param {number} props.averageHours - Giờ ngủ trung bình
 * @param {number} props.averageQuality - Chất lượng trung bình (%)
 */
export default function WeeklyAverageCards({ averageHours = 0, averageQuality = 0 }) {
    const stats = [
        {
            icon: 'bed',
            label: 'Giờ ngủ/đêm',
            value: `${averageHours.toFixed(1)}h`,
            gradient: ['#6366f1', '#8b5cf6'],
        },
        {
            icon: 'star',
            label: 'Chất lượng',
            value: `${averageQuality}%`,
            gradient: ['#ec4899', '#f43f5e'],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="calendar" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Trung bình tuần này</Text>
            </View>

            <View style={styles.cardsContainer}>
                {stats.map((stat, index) => (
                    <LinearGradient
                        key={index}
                        colors={stat.gradient}
                        style={styles.statCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name={stat.icon} size={24} color={Colors.white} />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    </LinearGradient>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        marginTop: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    cardsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.purple[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statInfo: {
        gap: 4,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.white,
    },
    statLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
});
