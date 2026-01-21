import WeeklyWaterChart from '@/components/charts/WeeklyWaterChart';
import DailyGoalCard from '@/components/ui/DailyGoalCard';
import Toast from '@/components/ui/Toast';
import WaterReminders from '@/components/ui/WaterReminders';
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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WaterScreen() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [waterIntake, setWaterIntake] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(2000);
    const [glassSize, setGlassSize] = useState(200);
    const [loading, setLoading] = useState(true);

    // Weekly data
    const [weeklyData, setWeeklyData] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadWaterData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    // Reload data when tab becomes focused
    useFocusEffect(
        useCallback(() => {
            if (!authLoading && isAuthenticated) {
                loadWaterData();
            }
        }, [authLoading, isAuthenticated])
    );

    const loadWaterData = async () => {
        try {
            const today = firebaseApi.getTodayDate();

            // Load settings
            const settings = await firebaseApi.getUserSettings();
            setDailyGoal(settings.daily_water_goal || 2000);
            setGlassSize(settings.glass_size || 200);

            // Load today's water
            const waterData = await firebaseApi.getWaterLogs(today);
            setWaterIntake(waterData.total || 0);

            // Load weekly data
            await loadWeeklyWaterData();

            // Load reminders (from settings or default)
            setReminders(settings.water_reminders || []);
        } catch (error) {
            console.error('Error loading water data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadWeeklyWaterData = async () => {
        try {
            const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const chartData = [];

            // Get last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayIndex = date.getDay();

                const waterData = await firebaseApi.getWaterLogs(dateStr);
                chartData.push({
                    day: dayLabels[dayIndex],
                    amount: waterData.total || 0,
                    goal: dailyGoal
                });
            }

            setWeeklyData(chartData);
        } catch (error) {
            console.error('Error loading weekly water data:', error);
        }
    };

    const addWater = async (amount) => {
        try {
            const today = firebaseApi.getTodayDate();
            const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            await firebaseApi.addWaterLog({
                date: today,
                amount: amount,
                time: now,
            });

            const newWaterIntake = waterIntake + amount;
            setWaterIntake(newWaterIntake);

            // Kiểm tra nếu đạt mục tiêu
            const percentage = (newWaterIntake / dailyGoal) * 100;
            if (newWaterIntake >= dailyGoal && waterIntake < dailyGoal) {
                // Lần đầu đạt goal
                const notificationResult = await notificationService.showWaterGoalAchievedNotification({
                    amount: newWaterIntake,
                    goal: dailyGoal,
                    percentage: percentage,
                });

                // Fallback nếu notification fail
                if (!notificationResult.success) {
                    setToastMessage(`Tuyệt vời! 💧\nĐã hoàn thành mục tiêu ${dailyGoal}ml!`);
                    setShowToast(true);
                }
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể thêm nước');
        }
    };

    const handleGoalChange = async (newGoal) => {
        try {
            setDailyGoal(newGoal);
            await firebaseApi.updateUserSettings({ daily_water_goal: newGoal });
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật mục tiêu');
        }
    };

    const handleReminderToggle = async (id, value, updatedReminders) => {
        try {
            setReminders(updatedReminders);
            await firebaseApi.updateUserSettings({ water_reminders: updatedReminders });

            // TODO: Schedule/cancel notification based on value
            if (value) {
                console.log(`Schedule notification for ${id}`);
            } else {
                console.log(`Cancel notification for ${id}`);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật nhắc nhở');
        }
    };

    const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);
    const glassCount = Math.floor(waterIntake / glassSize);
    const totalGlasses = Math.ceil(dailyGoal / glassSize);

    return (
        <>
            <Toast
                visible={showToast}
                message={toastMessage}
                type="success"
                onHide={() => setShowToast(false)}
            />
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
                            onPress={() => addWater(100)}
                            style={styles.actionButton}
                        >
                            <Text style={styles.actionText}>+100ml</Text>
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
                        {Array.from({ length: totalGlasses }).map((_, index) => {
                            const isFilled = index < glassCount;
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.glass,
                                        isFilled && styles.glassFilled,
                                    ]}
                                >
                                    {isFilled ? (
                                        <LinearGradient
                                            colors={['#3b82f6', '#06b6d4']}
                                            style={styles.waterDrop}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Ionicons
                                                name="water"
                                                size={24}
                                                color={Colors.white}
                                            />
                                        </LinearGradient>
                                    ) : (
                                        <Ionicons
                                            name="water"
                                            size={24}
                                            color={Colors.gray[300]}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                    <Text style={styles.glassCount}>
                        {glassCount} / {totalGlasses} ly
                    </Text>
                </View>

                {/* Weekly Water Chart */}
                <WeeklyWaterChart weeklyData={weeklyData} />

                {/* Daily Goal Card */}
                <DailyGoalCard
                    dailyGoal={dailyGoal}
                    onGoalChange={handleGoalChange}
                />

                {/* Water Reminders */}
                <WaterReminders
                    reminders={reminders}
                    onToggle={handleReminderToggle}
                />

                {/* Tips */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💧 Lợi ích của việc uống đủ nước</Text>
                    <Text style={styles.tipsText}>
                        • Cải thiện năng lượng và tập trung{'\n'}
                        • Hỗ trợ tiêu hóa và giảm cân{'\n'}
                        • Làm đẹp da và chống lão hóa
                    </Text>
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
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    waterDisplay: {
        alignItems: 'center',
        marginBottom: 24,
    },
    waterAmount: {
        fontSize: 56,
        fontWeight: '700',
        color: Colors.white,
    },
    waterUnit: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    waterPercentage: {
        fontSize: 20,
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
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
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
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    glassFilled: {
        backgroundColor: 'transparent',
    },
    waterDrop: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    glassCount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        textAlign: 'center',
    },
    tipsCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: Colors.blue[50],
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: Colors.blue[200],
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 8,
    },
    tipsText: {
        fontSize: 14,
        color: Colors.gray[700],
        lineHeight: 22,
    },
});
