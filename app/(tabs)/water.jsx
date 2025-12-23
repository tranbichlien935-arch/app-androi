import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WaterScreen() {
    const [waterIntake, setWaterIntake] = useState(1600);
    const dailyGoal = 2000;
    const glassSize = 200;

    const addWater = (amount) => {
        setWaterIntake((prev) => Math.min(prev + amount, dailyGoal + 1000));
    };

    const removeWater = (amount) => {
        setWaterIntake((prev) => Math.max(prev - amount, 0));
    };

    const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);
    const glassCount = Math.floor(waterIntake / glassSize);
    const totalGlasses = Math.ceil(dailyGoal / glassSize);

    const weeklyData = [
        { day: 'T2', amount: 1800 },
        { day: 'T3', amount: 2200 },
        { day: 'T4', amount: 1600 },
        { day: 'T5', amount: 2000 },
        { day: 'T6', amount: 2400 },
        { day: 'T7', amount: 1900 },
        { day: 'CN', amount: 1600 },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Main Water Tracker */}
            <LinearGradient
                colors={['#3b82f6', '#06b6d4']}
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTitle}>
                    <Ionicons name="water" size={24} color={Colors.white} />
                    <Text style={styles.headerText}>Lượng nước hôm nay</Text>
                </View>

                {/* Water Amount Display */}
                <View style={styles.waterDisplay}>
                    <Text style={styles.waterAmount}>{waterIntake}</Text>
                    <Text style={styles.waterUnit}>ml / {dailyGoal} ml</Text>
                    <Text style={styles.waterPercentage}>{Math.round(percentage)}%</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        onPress={() => addWater(100)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>+100ml</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => addWater(200)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>+200ml</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => addWater(300)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>+300ml</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => removeWater(100)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>-100ml</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Glass Counter */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="water" size={20} color={Colors.blue[600]} />
                    <Text style={styles.cardTitle}>Ly nước đã uống</Text>
                </View>
                <View style={styles.glassGrid}>
                    {Array.from({ length: totalGlasses }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.glass,
                                index < glassCount ? styles.glassFilled : styles.glassEmpty,
                            ]}
                        >
                            <Ionicons
                                name="water"
                                size={16}
                                color={index < glassCount ? Colors.white : Colors.gray[400]}
                            />
                        </View>
                    ))}
                </View>
                <Text style={styles.glassCount}>
                    {glassCount} / {totalGlasses} ly ({glassSize}ml/ly)
                </Text>
            </View>

            {/* Weekly Progress */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="trending-up" size={20} color={Colors.blue[600]} />
                    <Text style={styles.cardTitle}>Tiến trình tuần</Text>
                </View>
                <View style={styles.weeklyList}>
                    {weeklyData.map((day, index) => (
                        <View key={index} style={styles.weeklyItem}>
                            <Text style={styles.dayLabel}>{day.day}</Text>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min((day.amount / dailyGoal) * 100, 100)}%`,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.amountLabel}>{day.amount}ml</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerCard: {
        margin: 16,
        marginTop: 8,
        borderRadius: 24,
        padding: 24,
        shadowColor: Colors.blue[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
    },
    waterDisplay: {
        alignItems: 'center',
        marginBottom: 24,
    },
    waterAmount: {
        fontSize: 56,
        fontWeight: '600',
        color: Colors.white,
    },
    waterUnit: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    waterPercentage: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.white,
        marginTop: 8,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.white,
    },
    card: {
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    glassGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    glass: {
        width: 40,
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassFilled: {
        backgroundColor: Colors.blue[600],
    },
    glassEmpty: {
        backgroundColor: Colors.gray[200],
    },
    glassCount: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    weeklyList: {
        gap: 12,
    },
    weeklyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dayLabel: {
        fontSize: 14,
        color: Colors.gray[600],
        width: 32,
    },
    progressBarBg: {
        flex: 1,
        height: 12,
        backgroundColor: Colors.gray[200],
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.blue[600],
        borderRadius: 6,
    },
    amountLabel: {
        fontSize: 14,
        color: Colors.gray[600],
        width: 64,
        textAlign: 'right',
    },
});
