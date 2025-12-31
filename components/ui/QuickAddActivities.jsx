import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuickAddActivities({ onSelectActivity }) {
    const quickActivities = [
        {
            name: 'Đi bộ',
            icon: 'walk',
            color: '#22c55e',
            bg: '#dcfce7',
            duration: 30,
            calories: 120
        },
        {
            name: 'Chạy bộ',
            icon: 'fitness',
            color: '#f97316',
            bg: '#ffedd5',
            duration: 45,
            calories: 350
        },
        {
            name: 'Đạp xe',
            icon: 'bicycle',
            color: '#3b82f6',
            bg: '#dbeafe',
            duration: 60,
            calories: 400
        },
        {
            name: 'Bơi lội',
            icon: 'water',
            color: '#06b6d4',
            bg: '#cffafe',
            duration: 45,
            calories: 300
        },
        {
            name: 'Yoga',
            icon: 'body',
            color: '#a855f7',
            bg: '#f3e8ff',
            duration: 25,
            calories: 80
        },
        {
            name: 'Gym',
            icon: 'barbell',
            color: '#ef4444',
            bg: '#fee2e2',
            duration: 60,
            calories: 450
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thêm hoạt động nhanh</Text>
            <View style={styles.grid}>
                {quickActivities.map((activity, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, { backgroundColor: activity.bg }]}
                        onPress={() => onSelectActivity(activity)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                            <Ionicons name={activity.icon} size={24} color={Colors.white} />
                        </View>
                        <Text style={styles.buttonText}>{activity.name}</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    button: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray[700],
        textAlign: 'center',
    },
});
