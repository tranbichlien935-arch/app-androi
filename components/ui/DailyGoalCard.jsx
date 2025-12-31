import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Component hiển thị và điều chỉnh mục tiêu hàng ngày
 * @param {Object} props
 * @param {number} props.dailyGoal - Mục tiêu ml/ngày
 * @param {function} props.onGoalChange - Callback khi thay đổi goal
 */
export default function DailyGoalCard({ dailyGoal = 2000, onGoalChange }) {
    const [goal, setGoal] = useState(dailyGoal);

    const handleDecrease = () => {
        const newGoal = Math.max(500, goal - 100); // Min 500ml
        setGoal(newGoal);
        onGoalChange?.(newGoal);
    };

    const handleIncrease = () => {
        const newGoal = Math.min(5000, goal + 100); // Max 5000ml
        setGoal(newGoal);
        onGoalChange?.(newGoal);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="water" size={20} color={Colors.blue[600]} />
                </View>
                <Text style={styles.title}>Mục tiêu hàng ngày</Text>
            </View>

            <View style={styles.goalContainer}>
                <TouchableOpacity
                    onPress={handleDecrease}
                    style={styles.button}
                    disabled={goal <= 500}
                >
                    <Ionicons
                        name="remove"
                        size={24}
                        color={goal <= 500 ? Colors.gray[300] : Colors.blue[600]}
                    />
                </TouchableOpacity>

                <View style={styles.goalDisplay}>
                    <Text style={styles.goalValue}>{goal}</Text>
                    <Text style={styles.goalUnit}>ml / ngày</Text>
                </View>

                <TouchableOpacity
                    onPress={handleIncrease}
                    style={styles.button}
                    disabled={goal >= 5000}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={goal >= 5000 ? Colors.gray[300] : Colors.blue[600]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
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
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.blue[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    goalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.blue[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalDisplay: {
        alignItems: 'center',
        flex: 1,
    },
    goalValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.blue[600],
    },
    goalUnit: {
        fontSize: 14,
        color: Colors.gray[600],
        marginTop: 4,
    },
});
