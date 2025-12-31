import WeightChart from '@/components/charts/WeightChart';
import BMIIndicator from '@/components/ui/BMIIndicator';
import MilestoneTimeline from '@/components/ui/MilestoneTimeline';
import WeightStatistics from '@/components/ui/WeightStatistics';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WeightScreen() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [currentWeight, setCurrentWeight] = useState(0);
    const [targetWeight, setTargetWeight] = useState(65);
    const [startWeight, setStartWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [bmi, setBmi] = useState(0);
    const [newWeight, setNewWeight] = useState('');
    const [editingSettings, setEditingSettings] = useState(false);
    const [tempTarget, setTempTarget] = useState('');
    const [tempStart, setTempStart] = useState('');
    const [loading, setLoading] = useState(true);

    // New state for chart and statistics
    const [chartData, setChartData] = useState({ labels: [], values: [] });
    const [statistics, setStatistics] = useState({
        averageWeeklyLoss: 0,
        estimatedWeeks: 0,
        totalLoss: 0,
        remaining: 0,
    });
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadWeightData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    // Reload data when tab becomes focused
    useFocusEffect(
        useCallback(() => {
            if (!authLoading && isAuthenticated) {
                loadWeightData();
            }
        }, [authLoading, isAuthenticated])
    );

    const loadWeightData = async () => {
        try {
            // Load user profile for height
            const profile = await firebaseApi.getUserProfile();
            setHeight(profile.height || 170);

            // Load settings for weight goals
            const settings = await firebaseApi.getUserSettings();
            setTargetWeight(settings.target_weight || 65);
            setStartWeight(settings.start_weight || 70);

            // Load weight logs (30 days for calculations)
            const weightLogs = await firebaseApi.getWeightLogs(30);
            console.log('Weight logs loaded:', weightLogs);

            if (weightLogs && weightLogs.length > 0) {
                console.log('Setting current weight:', weightLogs[0].weight);
                setCurrentWeight(weightLogs[0].weight);
                setBmi(weightLogs[0].bmi || 0);

                // Process data for chart and statistics
                processWeightData(weightLogs, settings.target_weight || 65, settings.start_weight || 70);
            } else {
                console.log('No weight logs found, setting to 0');
                setCurrentWeight(0);
                setBmi(0);
                setChartData({ labels: [], values: [] });
            }
        } catch (error) {
            console.error('Error loading weight data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process weight data for chart, statistics, and milestones
    const processWeightData = (logs, target, start) => {
        // Prepare chart data (last 7 days)
        const last7Days = logs.slice(0, 7).reverse();
        const labels = last7Days.map(log => {
            const date = new Date(log.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const values = last7Days.map(log => log.weight);
        setChartData({ labels, values });

        // Calculate statistics (4 weeks = 28 days)
        const last4Weeks = logs.slice(0, 28);
        if (last4Weeks.length >= 2) {
            const oldestWeight = last4Weeks[last4Weeks.length - 1].weight;
            const newestWeight = last4Weeks[0].weight;
            const totalChange = oldestWeight - newestWeight;
            const weeks = last4Weeks.length / 7;
            const avgWeeklyLoss = totalChange / weeks;

            const currentWeight = logs[0].weight;
            const totalLoss = start - currentWeight;
            const remaining = currentWeight - target;
            const estimatedWeeks = avgWeeklyLoss > 0 ? Math.ceil(remaining / avgWeeklyLoss) : 0;

            setStatistics({
                averageWeeklyLoss: avgWeeklyLoss,
                estimatedWeeks: estimatedWeeks > 0 ? estimatedWeeks : 0,
                totalLoss: totalLoss,
                remaining: remaining,
            });
        }

        // Calculate milestones (every 2kg from start to target)
        const milestonesArray = [];
        const step = start > target ? -2 : 2; // Determine direction
        const direction = start > target ? -1 : 1;

        let currentMilestone = start;
        while ((direction > 0 && currentMilestone <= target) || (direction < 0 && currentMilestone >= target)) {
            const completed = logs.some(log => {
                if (direction > 0) {
                    return log.weight >= currentMilestone;
                } else {
                    return log.weight <= currentMilestone;
                }
            });

            const completedLog = logs.find(log => {
                if (direction > 0) {
                    return log.weight >= currentMilestone;
                } else {
                    return log.weight <= currentMilestone;
                }
            });

            milestonesArray.push({
                weight: currentMilestone,
                completed: completed,
                date: completedLog ? firebaseApi.formatDate(completedLog.date) : null,
                estimatedDate: null, // Can add estimation logic here
            });

            currentMilestone += step;
        }

        setMilestones(milestonesArray);
    };

    const saveWeight = async () => {
        const weight = parseFloat(newWeight);

        if (!weight || weight <= 0 || isNaN(weight)) {
            Alert.alert('Lỗi', 'Vui lòng nhập cân nặng hợp lệ');
            return;
        }

        try {
            const today = firebaseApi.getTodayDate();

            await firebaseApi.addWeightLog({
                date: today,
                weight: weight,
            });

            setNewWeight('');
            Alert.alert('Thành công', `Đã lưu cân nặng: ${weight}kg`);

            // Reload all data to get fresh values
            await loadWeightData();
        } catch (error) {
            console.error('Error saving weight:', error);
            Alert.alert('Lỗi', `Không thể lưu cân nặng: ${error.message}`);
        }
    };

    const saveSettings = async () => {
        const targetVal = parseFloat(tempTarget);
        const startVal = parseFloat(tempStart);

        if (!targetVal || targetVal <= 0 || isNaN(targetVal)) {
            return;
        }
        if (!startVal || startVal <= 0 || isNaN(startVal)) {
            return;
        }

        try {
            // Update weight goals only
            await firebaseApi.updateUserSettings({
                target_weight: targetVal,
                start_weight: startVal,
            });

            setTargetWeight(targetVal);
            setStartWeight(startVal);
            setEditingSettings(false);
            await loadWeightData(); // Reload to recalculate progress
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    // Calculate progress properly
    const getProgress = () => {
        if (!startWeight || !targetWeight || !currentWeight) return 0;

        const totalChange = Math.abs(targetWeight - startWeight);
        if (totalChange === 0) return 100; // Already at target

        const currentChange = Math.abs(currentWeight - startWeight);
        const progress = (currentChange / totalChange) * 100;

        return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
    };

    // Calculate weight change from start
    const getWeightChange = () => {
        if (!startWeight || !currentWeight) return { value: 0, text: '0.0kg', isGaining: false };

        const change = currentWeight - startWeight;
        const isGaining = change > 0;
        const text = `${isGaining ? '+' : ''}${change.toFixed(1)}kg`;

        return { value: change, text, isGaining };
    };

    // Calculate BMI locally as backup
    const calculateBMI = () => {
        if (!height || !currentWeight || height <= 0) return 0;
        const heightInMeters = height / 100;
        return currentWeight / (heightInMeters * heightInMeters);
    };

    const progress = getProgress();
    const weightChange = getWeightChange();
    const displayBMI = bmi > 0 ? bmi : calculateBMI();

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.green[600]} />
                <Text style={{ marginTop: 16, color: Colors.gray[600] }}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#22c55e', '#10b981']}
                style={styles.headerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTitle}>
                    <Ionicons name="scale" size={24} color={Colors.white} />
                    <Text style={styles.headerText}>Cân nặng hiện tại</Text>
                </View>

                <View style={styles.weightDisplay}>
                    <Text style={styles.weightValue}>{currentWeight || 0}</Text>
                    <Text style={styles.weightUnit}>kg</Text>
                </View>

                {/* Weight Change Indicator */}
                {currentWeight > 0 && startWeight > 0 && (
                    <View style={styles.weightChangeContainer}>
                        <Ionicons
                            name={weightChange.isGaining ? "trending-up" : "trending-down"}
                            size={16}
                            color={weightChange.isGaining ? "#fbbf24" : "#10b981"}
                        />
                        <Text style={[
                            styles.weightChangeText,
                            { color: weightChange.isGaining ? "#fbbf24" : "#10b981" }
                        ]}>
                            {weightChange.text} từ khi bắt đầu
                        </Text>
                    </View>
                )}

                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Tiến độ</Text>
                        <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
                    </View>
                    <View style={styles.progressLabels}>
                        <Text style={styles.progressText}>Bắt đầu: {startWeight}kg</Text>
                        <Text style={styles.progressText}>Mục tiêu: {targetWeight}kg</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Weight Chart */}
            <WeightChart
                data={chartData}
                startWeight={startWeight}
                targetWeight={targetWeight}
            />

            {/* BMI Indicator */}
            <BMIIndicator bmi={displayBMI} height={height} />

            {/* Statistics */}
            {currentWeight > 0 && (
                <WeightStatistics statistics={statistics} />
            )}

            {/* Milestones */}
            {milestones.length > 0 && (
                <MilestoneTimeline milestones={milestones} />
            )}

            {/* Settings Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Cài đặt mục tiêu</Text>
                    <TouchableOpacity onPress={() => {
                        if (editingSettings) {
                            setEditingSettings(false);
                        } else {
                            setTempTarget(targetWeight.toString());
                            setTempStart(startWeight.toString());
                            setEditingSettings(true);
                        }
                    }}>
                        <Ionicons
                            name={editingSettings ? "close" : "create-outline"}
                            size={24}
                            color={Colors.green[600]}
                        />
                    </TouchableOpacity>
                </View>

                {editingSettings ? (
                    <View style={styles.settingsForm}>
                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Cân nặng ban đầu (kg)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={tempStart}
                                onChangeText={setTempStart}
                                placeholder="70"
                                keyboardType="decimal-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Cân nặng mục tiêu (kg)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={tempTarget}
                                onChangeText={setTempTarget}
                                placeholder="65"
                                keyboardType="decimal-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>
                        <TouchableOpacity onPress={saveSettings} style={styles.saveSettingsButton}>
                            <LinearGradient
                                colors={Colors.gradient.green}
                                style={styles.saveSettingsGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.saveSettingsText}>Lưu cài đặt</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.settingsDisplay}>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingDisplayLabel}>Chiều cao:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={styles.settingDisplayValue}>{height} cm</Text>
                                <Text style={[styles.settingDisplayLabel, { fontSize: 12, fontStyle: 'italic' }]}>
                                    (Sửa ở Profile)
                                </Text>
                            </View>
                        </View>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingDisplayLabel}>Cân nặng ban đầu:</Text>
                            <Text style={styles.settingDisplayValue}>{startWeight} kg</Text>
                        </View>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingDisplayLabel}>Cân nặng mục tiêu:</Text>
                            <Text style={styles.settingDisplayValue}>{targetWeight} kg</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Add Weight */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Cập nhật cân nặng</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={newWeight}
                        onChangeText={setNewWeight}
                        placeholder="Nhập cân nặng (kg)"
                        keyboardType="decimal-pad"
                        placeholderTextColor={Colors.gray[400]}
                    />
                    <TouchableOpacity onPress={saveWeight} style={styles.addButton}>
                        <LinearGradient
                            colors={Colors.gradient.green}
                            style={styles.addButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="add" size={24} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>⚖️ Mẹo giảm cân hiệu quả</Text>
                <Text style={styles.tipsText}>
                    • Cân mỗi sáng sau khi đi vệ sinh{'\n'}
                    • Ăn đủ chất, giảm calo từ từ{'\n'}
                    • Kết hợp vận động 30 phút/ngày
                </Text>
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
        shadowColor: Colors.green[500],
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
    weightDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 24,
    },
    weightValue: {
        fontSize: 64,
        fontWeight: '700',
        color: Colors.white,
    },
    weightUnit: {
        fontSize: 24,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginLeft: 8,
    },
    weightChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 12,
    },
    weightChangeText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.white,
    },
    progressSection: {
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    progressValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    bmiCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    bmiLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 4,
    },
    bmiValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 4,
    },
    bmiStatus: {
        fontSize: 14,
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.gray[900],
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
    },
    addButtonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipsCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: Colors.green[50],
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: Colors.green[200],
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    settingsForm: {
        gap: 16,
    },
    settingItem: {
        gap: 8,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[700],
    },
    settingInput: {
        height: 48,
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.gray[900],
    },
    saveSettingsButton: {
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    saveSettingsGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveSettingsText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    settingsDisplay: {
        gap: 12,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingDisplayLabel: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    settingDisplayValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
});
