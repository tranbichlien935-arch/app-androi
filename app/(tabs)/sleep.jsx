import SleepStagesChart from '@/components/charts/SleepStagesChart';
import WeeklySleepChart from '@/components/charts/WeeklySleepChart';
import SleepSchedule from '@/components/ui/SleepSchedule';
import Toast from '@/components/ui/Toast';
import WeeklyAverageCards from '@/components/ui/WeeklyAverageCards';
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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SleepScreen() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [totalHours, setTotalHours] = useState(0);
    const [quality, setQuality] = useState(0);
    const [loading, setLoading] = useState(true);

    // Weekly data states
    const [weeklyData, setWeeklyData] = useState([]);
    const [averageHours, setAverageHours] = useState(0);
    const [averageQuality, setAverageQuality] = useState(0);
    const [deepSleep, setDeepSleep] = useState(0);
    const [lightSleep, setLightSleep] = useState(0);
    const [remSleep, setRemSleep] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadSleepData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    // Reload data when tab becomes focused
    useFocusEffect(
        useCallback(() => {
            if (!authLoading && isAuthenticated) {
                loadSleepData();
            }
        }, [authLoading, isAuthenticated])
    );

    const loadSleepData = async () => {
        try {
            const today = firebaseApi.getTodayDate();
            const sleepData = await firebaseApi.getSleepLogs(today);

            if (sleepData) {
                setBedTime(sleepData.bed_time || '23:00');
                setWakeTime(sleepData.wake_time || '07:00');
                setTotalHours(sleepData.total_hours || 0);
                setQuality(sleepData.quality || 0);
                setDeepSleep(sleepData.deep_sleep || 0);
                setLightSleep(sleepData.light_sleep || 0);
                setRemSleep(sleepData.rem_sleep || 0);
            }

            // Load weekly data
            await loadWeeklySleepData();
        } catch (error) {
            console.error('Error loading sleep data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadWeeklySleepData = async () => {
        try {
            const weeklyLogs = await firebaseApi.getSleepLogs(null, 7);

            // Prepare data for chart
            const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const chartData = [];

            // Get last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayIndex = date.getDay();

                const log = weeklyLogs.find(l => l.date === dateStr);
                chartData.push({
                    day: dayLabels[dayIndex],
                    hours: log ? log.total_hours : 0
                });
            }

            setWeeklyData(chartData);

            // Calculate averages
            if (weeklyLogs.length > 0) {
                const totalHrs = weeklyLogs.reduce((sum, log) => sum + (log.total_hours || 0), 0);
                const totalQuality = weeklyLogs.reduce((sum, log) => sum + (log.quality || 0), 0);
                setAverageHours(totalHrs / weeklyLogs.length);
                setAverageQuality(Math.round(totalQuality / weeklyLogs.length));
            }
        } catch (error) {
            console.error('Error loading weekly sleep data:', error);
        }
    };

    const saveSleepData = async () => {
        try {
            const today = firebaseApi.getTodayDate();

            // Calculate total hours (simplified)
            const bedHour = parseInt(bedTime.split(':')[0]);
            const wakeHour = parseInt(wakeTime.split(':')[0]);
            let hours = wakeHour - bedHour;
            if (hours < 0) hours += 24;

            await firebaseApi.addSleepLog({
                date: today,
                bed_time: bedTime,
                wake_time: wakeTime,
                total_hours: hours,
                quality: quality,
                deep_sleep: hours * 0.3,
                light_sleep: hours * 0.5,
                rem_sleep: hours * 0.2,
            });

            setTotalHours(hours);

            // Hiển thị notification
            const notificationResult = await notificationService.showSleepGoalAchievedNotification({
                hours: hours,
                quality: quality,
            });

            // Fallback nếu notification fail
            if (!notificationResult.success) {
                let message = `Đã lưu giấc ngủ! 🌙\n${hours.toFixed(1)} giờ`;
                if (quality > 0) {
                    message += ` • ${quality}% chất lượng`;
                }
                setToastMessage(message);
                setShowToast(true);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu dữ liệu');
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
                <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.headerCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerTitle}>
                        <Ionicons name="moon" size={24} color={Colors.white} />
                        <Text style={styles.headerText}>Giấc ngủ đêm qua</Text>
                    </View>

                    <View style={styles.sleepSummary}>
                        <Text style={styles.sleepHours}>{totalHours.toFixed(1)}h</Text>
                        <Text style={styles.sleepLabel}>Tổng thời gian ngủ</Text>
                    </View>

                    <View style={styles.qualityBar}>
                        <Text style={styles.qualityLabel}>Chất lượng: {quality}%</Text>
                        <View style={styles.qualityBarBg}>
                            <View style={[styles.qualityBarFill, { width: `${quality}%` }]} />
                        </View>
                    </View>

                    <View style={styles.timesGrid}>
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Đi ngủ</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={bedTime}
                                onChangeText={setBedTime}
                                placeholder="23:00"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Thức dậy</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={wakeTime}
                                onChangeText={setWakeTime}
                                placeholder="07:00"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={saveSleepData} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Lưu dữ liệu</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Sleep Stages Chart */}
                <SleepStagesChart
                    deepSleep={deepSleep}
                    lightSleep={lightSleep}
                    remSleep={remSleep}
                />

                {/* Weekly Sleep Chart */}
                <WeeklySleepChart weeklyData={weeklyData} />

                {/* Sleep Schedule */}
                <SleepSchedule bedTime={bedTime} wakeTime={wakeTime} />

                {/* Weekly Average Cards */}
                <WeeklyAverageCards
                    averageHours={averageHours}
                    averageQuality={averageQuality}
                />

                {/* Tips */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>🌙 Mẹo ngủ ngon</Text>
                    <Text style={styles.tipsText}>
                        • Ngủ đủ 7-9 giờ mỗi đêm{'\n'}
                        • Tránh caffeine sau 14h{'\n'}
                        • Tắt điện thoại trước khi ngủ 30 phút
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
        shadowColor: Colors.purple[500],
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
    sleepSummary: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sleepHours: {
        fontSize: 56,
        fontWeight: '700',
        color: Colors.white,
    },
    sleepLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    qualityBar: {
        marginBottom: 20,
    },
    qualityLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    qualityBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    qualityBarFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 4,
    },
    timesGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    timeItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
    },
    timeLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    timeInput: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.white,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    tipsCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: Colors.purple[50],
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: Colors.purple[200],
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
