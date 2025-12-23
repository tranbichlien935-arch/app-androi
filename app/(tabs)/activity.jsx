import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ActivityScreen() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [loading, setLoading] = useState(true);
    const [todayTotal, setTodayTotal] = useState({
        steps: 0,
        distance: 0,
        calories: 0,
        activeMinutes: 0,
    });
    const [weeklyStepsData, setWeeklyStepsData] = useState({
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    });
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        name: '',
        duration: '',
        calories: '',
    });

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadActivityData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    const loadActivityData = async () => {
        try {
            const today = firebaseApi.getTodayDate();

            // Load today's summary
            const summary = await firebaseApi.getDailySummary(today);
            setTodayTotal({
                steps: summary.steps || 0,
                distance: summary.distance || 0,
                calories: summary.calories || 0,
                activeMinutes: summary.active_minutes || 0,
            });

            // Load weekly data for chart
            const weeklySummaries = await firebaseApi.getDailySummary(null, 7);
            const weeklySteps = weeklySummaries.map(s => s.steps || 0);
            setWeeklyStepsData({
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{ data: weeklySteps.length === 7 ? weeklySteps.reverse() : [0, 0, 0, 0, 0, 0, 0] }],
            });

            // Load recent activities
            const recentActivities = await firebaseApi.getActivities(null, 10);
            setActivities(recentActivities);
        } catch (error) {
            console.error('Error loading activity data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddActivity = async () => {
        if (!newActivity.name || !newActivity.duration || !newActivity.calories) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const today = firebaseApi.getTodayDate();
            const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            await firebaseApi.createActivity({
                name: newActivity.name,
                duration: parseInt(newActivity.duration),
                calories: parseInt(newActivity.calories),
                distance: 0,
                time: now,
                date: today,
            });

            // Update daily summary
            await firebaseApi.updateDailySummary({
                date: today,
                steps: todayTotal.steps,
                distance: todayTotal.distance,
                calories: todayTotal.calories + parseInt(newActivity.calories),
                active_minutes: todayTotal.activeMinutes + parseInt(newActivity.duration),
            });

            setNewActivity({ name: '', duration: '', calories: '' });
            setShowAddActivity(false);
            loadActivityData();
            Alert.alert('Thành công', 'Đã thêm hoạt động');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể thêm hoạt động');
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Stats */}
            <LinearGradient
                colors={['#f97316', '#dc2626']}
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.headerTitle}>Tổng hợp hôm nay</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Ionicons name="footsteps" size={24} color={Colors.white} />
                        <Text style={styles.statValue}>{todayTotal.steps.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Bước chân</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="flame" size={24} color={Colors.white} />
                        <Text style={styles.statValue}>{todayTotal.calories}</Text>
                        <Text style={styles.statLabel}>Calo</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="navigate" size={24} color={Colors.white} />
                        <Text style={styles.statValue}>{todayTotal.distance.toFixed(1)}</Text>
                        <Text style={styles.statLabel}>km</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="time" size={24} color={Colors.white} />
                        <Text style={styles.statValue}>{todayTotal.activeMinutes}</Text>
                        <Text style={styles.statLabel}>Phút</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Weekly Chart */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Bước chân tuần này</Text>
                <BarChart
                    data={weeklyStepsData}
                    width={screenWidth - 64}
                    height={200}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: Colors.white,
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForLabels: { fontSize: 12 },
                    }}
                    style={styles.chart}
                    showValuesOnTopOfBars
                />
            </View>

            {/* Recent Activities */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Hoạt động gần đây</Text>
                    <TouchableOpacity onPress={() => setShowAddActivity(!showAddActivity)}>
                        <Ionicons name="add-circle" size={28} color={Colors.orange[600]} />
                    </TouchableOpacity>
                </View>

                {/* Add Activity Form */}
                {showAddActivity && (
                    <View style={styles.addForm}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên hoạt động"
                            value={newActivity.name}
                            onChangeText={(text) => setNewActivity({ ...newActivity, name: text })}
                            placeholderTextColor={Colors.gray[400]}
                        />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Phút"
                                value={newActivity.duration}
                                onChangeText={(text) => setNewActivity({ ...newActivity, duration: text })}
                                keyboardType="number-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Calo"
                                value={newActivity.calories}
                                onChangeText={(text) => setNewActivity({ ...newActivity, calories: text })}
                                keyboardType="number-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>
                        <TouchableOpacity onPress={handleAddActivity} style={styles.addButton}>
                            <LinearGradient
                                colors={Colors.gradient.orange}
                                style={styles.addButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.addButtonText}>Thêm hoạt động</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Activities List */}
                <View style={styles.activitiesList}>
                    {activities.length === 0 ? (
                        <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
                    ) : (
                        activities.map((activity) => (
                            <View key={activity.id} style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <Ionicons name="fitness" size={20} color={Colors.orange[600]} />
                                </View>
                                <View style={styles.activityInfo}>
                                    <Text style={styles.activityName}>{activity.name}</Text>
                                    <Text style={styles.activityTime}>{activity.time}</Text>
                                </View>
                                <View style={styles.activityStats}>
                                    <Text style={styles.activityDuration}>{activity.duration} phút</Text>
                                    <Text style={styles.activityCalories}>{activity.calories} kcal</Text>
                                </View>
                            </View>
                        ))
                    )}
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
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
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
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    addForm: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: Colors.gray[50],
        borderRadius: 12,
    },
    input: {
        height: 48,
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: Colors.gray[200],
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        height: 48,
        borderRadius: 8,
        overflow: 'hidden',
    },
    addButtonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    activitiesList: {
        gap: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.gray[500],
        fontSize: 14,
        paddingVertical: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.gray[50],
        borderRadius: 12,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.orange[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    activityStats: {
        alignItems: 'flex-end',
    },
    activityDuration: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
    },
    activityCalories: {
        fontSize: 12,
        color: Colors.orange[600],
    },
});
