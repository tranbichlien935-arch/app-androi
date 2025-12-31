import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Component hiển thị lịch ngủ đề xuất
 * @param {Object} props
 * @param {string} props.bedTime - Giờ đi ngủ (24h format)
 * @param {string} props.wakeTime - Giờ thức dậy (24h format)
 */
export default function SleepSchedule({ bedTime = '23:00', wakeTime = '07:00' }) {
    // Convert 24h to 12h format
    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${minutes} ${period}`;
    };

    const schedules = [
        {
            icon: 'moon',
            label: 'Giờ ngủ đề xuất',
            time: convertTo12Hour(bedTime),
            gradient: ['#6366f1', '#8b5cf6'],
            iconBg: Colors.purple[100],
            iconColor: Colors.purple[600],
        },
        {
            icon: 'sunny',
            label: 'Giờ thức đề xuất',
            time: convertTo12Hour(wakeTime),
            gradient: ['#f59e0b', '#f97316'],
            iconBg: Colors.orange[100],
            iconColor: Colors.orange[600],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="time" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Lịch ngủ của bạn</Text>
            </View>

            <View style={styles.schedulesContainer}>
                {schedules.map((schedule, index) => (
                    <View key={index} style={styles.scheduleCard}>
                        <View style={[styles.iconContainer, { backgroundColor: schedule.iconBg }]}>
                            <Ionicons name={schedule.icon} size={24} color={schedule.iconColor} />
                        </View>
                        <View style={styles.scheduleInfo}>
                            <Text style={styles.scheduleLabel}>{schedule.label}</Text>
                            <Text style={styles.scheduleTime}>{schedule.time}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.tipContainer}>
                <Ionicons name="information-circle" size={16} color={Colors.blue[600]} />
                <Text style={styles.tipText}>
                    Đi ngủ và thức dậy đúng giờ mỗi ngày giúp cơ thể điều hòa tốt hơn
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginTop: 0,
        shadowColor: Colors.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    schedulesContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    scheduleCard: {
        flex: 1,
        backgroundColor: Colors.gray[50],
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleInfo: {
        alignItems: 'center',
        gap: 4,
    },
    scheduleLabel: {
        fontSize: 12,
        color: Colors.gray[600],
        textAlign: 'center',
    },
    scheduleTime: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.gray[900],
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: Colors.blue[50],
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: Colors.blue[500],
    },
    tipText: {
        flex: 1,
        fontSize: 12,
        color: Colors.blue[900],
        lineHeight: 18,
    },
});
