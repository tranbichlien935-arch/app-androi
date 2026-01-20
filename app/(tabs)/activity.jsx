import QuickAddActivities from '@/components/ui/QuickAddActivities';
import Toast from '@/components/ui/Toast';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import firebaseApi from '@/services/firebase-api';
import notificationService from '@/services/notification-service';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadActivityData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    // Reload data when tab becomes focused
    useFocusEffect(
        useCallback(() => {
            if (!authLoading && isAuthenticated) {
                loadActivityData();
            }
        }, [authLoading, isAuthenticated])
    );

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

    const handleQuickAdd = (activity) => {
        setNewActivity({
            name: activity.name,
            duration: activity.duration.toString(),
        });
        setShowAddActivity(true);
    };

    const handleAddActivity = async () => {
        if (!newActivity.name || !newActivity.duration) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const today = firebaseApi.getTodayDate();
            const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const duration = parseInt(newActivity.duration);

            // Auto-calculate calories based on activity type
            let calories = 0;
            let distance = 0;
            const activityName = newActivity.name.toLowerCase();

            if (activityName.includes('đi bộ') || activityName.includes('walking')) {
                calories = duration * 4; // 4 kcal/min
                distance = (duration / 60) * 5; // 5 km/h
            } else if (activityName.includes('chạy') || activityName.includes('running')) {
                calories = duration * 10; // 10 kcal/min
                distance = (duration / 60) * 10; // 10 km/h
            } else if (activityName.includes('đạp xe') || activityName.includes('cycling')) {
                calories = duration * 8; // 8 kcal/min
                distance = (duration / 60) * 20; // 20 km/h
            } else if (activityName.includes('yoga')) {
                calories = duration * 3; // 3 kcal/min
            } else if (activityName.includes('gym')) {
                calories = duration * 6; // 6 kcal/min
            } else if (activityName.includes('bơi lội') || activityName.includes('swimming')) {
                calories = duration * 9; // 9 kcal/min
            } else {
                calories = duration * 5; // Default: 5 kcal/min
            }

            await firebaseApi.createActivity({
                name: newActivity.name,
                duration: duration,
                calories: calories,
                distance: distance,
                time: now,
                date: today,
            });

            // Update daily summary
            await firebaseApi.updateDailySummary({
                date: today,
                steps: todayTotal.steps,
                distance: todayTotal.distance + distance,
                calories: todayTotal.calories + calories,
                active_minutes: todayTotal.activeMinutes + duration,
            });

            setNewActivity({ name: '', duration: '' });
            setShowAddActivity(false);
            loadActivityData();

            // Hiển thị notification
            const notificationResult = await notificationService.showActivityCompletionNotification({
                activityName: newActivity.name,
                duration: duration,
                calories: calories,
                distance: distance,
            });

            // Fallback sang Toast nếu notification fail
            if (!notificationResult.success) {
                const message = `Hoàn thành ${newActivity.name}! 🎉\n💪 ${calories} kcal${distance > 0 ? ` • 🏃 ${distance.toFixed(1)} km` : ''}`;
                setToastMessage(message);
                setShowToast(true);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể thêm hoạt động');
        }
    };

    return (
        <>
            <Toast
                visible={showToast}
                message={toastMessage}
                type="success"
                onHide={() => setShowToast(false)}
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Stats */}
                <LinearGradient
                    colors={['#f97316', '#dc2626']}
                    style={styles.headerCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.headerTitle}>Tổng hợp hôm nay</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Ionicons name="footsteps" size={20} color={Colors.white} />
                                <Text style={styles.statValue}>{todayTotal.steps.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Bước chân</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Ionicons name="flame" size={20} color={Colors.white} />
                                <Text style={styles.statValue}>{todayTotal.calories}</Text>
                                <Text style={styles.statLabel}>kcal</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Ionicons name="navigate" size={20} color={Colors.white} />
                                <Text style={styles.statValue}>{todayTotal.distance.toFixed(1)}</Text>
                                <Text style={styles.statLabel}>km</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Ionicons name="time" size={20} color={Colors.white} />
                                <Text style={styles.statValue}>{todayTotal.activeMinutes}</Text>
                                <Text style={styles.statLabel}>phút</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Add Activities */}
                <QuickAddActivities onSelectActivity={handleQuickAdd} />

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

                {/* Add Activity Form */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Thêm hoạt động</Text>
                        {showAddActivity && (
                            <TouchableOpacity onPress={() => {
                                setShowAddActivity(false);
                                setNewActivity({ name: '', duration: '' });
                            }}>
                                <Ionicons name="close-circle" size={28} color={Colors.gray[400]} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {showAddActivity && (
                        <View style={styles.addForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tên hoạt động (VD: Đi bộ, Chạy, Đạp xe)"
                                value={newActivity.name}
                                onChangeText={(text) => setNewActivity({ ...newActivity, name: text })}
                                placeholderTextColor={Colors.gray[400]}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Số phút"
                                value={newActivity.duration}
                                onChangeText={(text) => setNewActivity({ ...newActivity, duration: text })}
                                keyboardType="number-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                            <Text style={styles.autoCalcHint}>💡 Calo sẽ được tự động tính dựa trên loại hoạt động</Text>
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
                </View>

                {/* Recent Activities */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Hoạt động gần đây</Text>
                    <View style={styles.activitiesList}>
                        {activities.length === 0 ? (
                            <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
                        ) : (
                            activities.map((activity) => {
                                // Calculate distance based on activity type and duration
                                let distance = activity.distance || 0;
                                if (distance === 0 && activity.duration) {
                                    // Estimate distance based on activity type
                                    const activityName = activity.name.toLowerCase();
                                    if (activityName.includes('đi bộ') || activityName.includes('walking')) {
                                        distance = (activity.duration / 60) * 5; // 5 km/h
                                    } else if (activityName.includes('chạy') || activityName.includes('running')) {
                                        distance = (activity.duration / 60) * 10; // 10 km/h
                                    } else if (activityName.includes('đạp xe') || activityName.includes('cycling')) {
                                        distance = (activity.duration / 60) * 20; // 20 km/h
                                    }
                                }

                                return (
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
                                            {distance > 0 && (
                                                <Text style={styles.activityDistance}>{distance.toFixed(1)} km</Text>
                                            )}
                                            <Text style={styles.activityCalories}>{activity.calories} kcal</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
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
    statsContainer: {
        gap: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
    },
    statLabel: {
        fontSize: 11,
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
    autoCalcHint: {
        fontSize: 12,
        color: Colors.gray[600],
        marginBottom: 12,
        fontStyle: 'italic',
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
    activityDistance: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.blue[600],
        marginTop: 2,
    },
    activityCalories: {
        fontSize: 12,
        color: Colors.orange[600],
        marginTop: 2,
    },
});
