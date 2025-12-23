import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ActivityScreen() {
    const [showAddActivity, setShowAddActivity] = useState(false);

    const weeklyStepsData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                data: [8234, 10542, 7890, 12340, 9876, 11234, 6543],
            },
        ],
    };

    const todayTotal = {
        steps: 8234,
        distance: 6.2,
        calories: 320,
        activeMinutes: 95,
    };

    const activities = [
        { id: 1, name: 'Đi bộ buổi sáng', duration: 30, calories: 120, time: '07:00' },
        { id: 2, name: 'Chạy bộ', duration: 45, calories: 350, time: '18:30' },
        { id: 3, name: 'Yoga', duration: 20, calories: 80, time: '20:00' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Stats */}
            <LinearGradient
                colors={['#f97316', '#dc2626']}
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerTitle}>
                    <Ionicons name="fitness" size={24} color={Colors.white} />
                    <Text style={styles.headerText}>Hoạt động hôm nay</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Ionicons name="footsteps" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.statValue}>{todayTotal.steps.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>bước</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="flame" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.statValue}>{todayTotal.calories}</Text>
                        <Text style={styles.statLabel}>kcal</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="navigate" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.statValue}>{todayTotal.distance}</Text>
                        <Text style={styles.statLabel}>km</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="time" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.statValue}>{todayTotal.activeMinutes}</Text>
                        <Text style={styles.statLabel}>phút</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Weekly Chart */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Biểu đồ tuần</Text>
                    <Ionicons name="calendar-outline" size={20} color={Colors.gray[400]} />
                </View>
                <BarChart
                    data={weeklyStepsData}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={{
                        backgroundColor: Colors.white,
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.7,
                    }}
                    style={styles.chart}
                />
            </View>

            {/* Recent Activities */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Hoạt động gần đây</Text>
                    <TouchableOpacity
                        onPress={() => setShowAddActivity(true)}
                        style={styles.addButton}
                    >
                        <Ionicons name="add" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={styles.activityList}>
                    {activities.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <LinearGradient
                                colors={Colors.gradient.orange}
                                style={styles.activityIcon}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="fitness" size={20} color={Colors.white} />
                            </LinearGradient>
                            <View style={styles.activityInfo}>
                                <Text style={styles.activityName}>{activity.name}</Text>
                                <Text style={styles.activityDetails}>
                                    {activity.time} • {activity.duration} phút
                                </Text>
                            </View>
                            <View style={styles.activityCalories}>
                                <Text style={styles.caloriesValue}>{activity.calories}</Text>
                                <Text style={styles.caloriesLabel}>kcal</Text>
                            </View>
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
        shadowColor: Colors.orange[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.white,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    addButton: {
        backgroundColor: Colors.orange[600],
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: Colors.slate[50],
        borderRadius: 12,
    },
    activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityInfo: {
        flex: 1,
    },
    activityName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
    },
    activityDetails: {
        fontSize: 12,
        color: Colors.gray[500],
        marginTop: 2,
    },
    activityCalories: {
        alignItems: 'flex-end',
    },
    caloriesValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.orange[600],
    },
    caloriesLabel: {
        fontSize: 12,
        color: Colors.gray[500],
    },
});
