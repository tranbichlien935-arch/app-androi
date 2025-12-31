import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

export default function WeightStatistics({ statistics }) {
    const {
        averageWeeklyLoss = 0,
        estimatedWeeks = 0,
        totalLoss = 0,
        remaining = 0,
    } = statistics;

    const stats = [
        {
            label: 'Giảm trung bình/tuần',
            value: `${averageWeeklyLoss.toFixed(1)} kg`,
            icon: 'trending-down',
            colors: Colors.gradient.green,
            bgColor: Colors.green[50],
            iconColor: Colors.green[600],
        },
        {
            label: 'Thời gian dự kiến',
            value: `${estimatedWeeks} tuần`,
            icon: 'time',
            colors: Colors.gradient.blue,
            bgColor: Colors.blue[50],
            iconColor: Colors.blue[600],
        },
        {
            label: 'Tổng đã giảm',
            value: `${totalLoss.toFixed(1)} kg`,
            icon: 'checkmark-circle',
            colors: Colors.gradient.purple,
            bgColor: Colors.purple[50],
            iconColor: Colors.purple[600],
        },
        {
            label: 'Còn lại',
            value: `${Math.abs(remaining).toFixed(1)} kg`,
            icon: 'flag',
            colors: Colors.gradient.orange,
            bgColor: Colors.orange[50],
            iconColor: Colors.orange[600],
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📈 Thống kê</Text>

            <View style={styles.grid}>
                {stats.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
                        <LinearGradient
                            colors={stat.colors}
                            style={styles.iconContainer}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name={stat.icon} size={20} color={Colors.white} />
                        </LinearGradient>

                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={[styles.statValue, { color: stat.iconColor }]}>
                            {stat.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '47.5%',
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.gray[600],
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
});
