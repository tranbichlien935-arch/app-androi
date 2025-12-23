import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
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
    const [tempHeight, setTempHeight] = useState('');
    const [tempTarget, setTempTarget] = useState('');
    const [tempStart, setTempStart] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadWeightData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    const loadWeightData = async () => {
        try {
            // Load settings
            const settings = await firebaseApi.getUserSettings();
            setTargetWeight(settings.target_weight || 65);
            setStartWeight(settings.start_weight || 70);
            setHeight(settings.height || 170);

            // Load latest weight
            const weightLogs = await firebaseApi.getWeightLogs(1);
            if (weightLogs.length > 0) {
                setCurrentWeight(weightLogs[0].weight);
                setBmi(weightLogs[0].bmi || 0);
            }
        } catch (error) {
            console.error('Error loading weight data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveWeight = async () => {
        const weight = parseFloat(newWeight);
        if (!weight || weight <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập cân nặng hợp lệ');
            return;
        }

        try {
            const today = firebaseApi.getTodayDate();
            const result = await firebaseApi.addWeightLog({
                date: today,
                weight: weight,
            });

            setCurrentWeight(weight);
            setBmi(result.bmi || 0);
            setNewWeight('');
            loadWeightData(); // Reload to update progress
            Alert.alert('Thành công', 'Đã lưu cân nặng');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu cân nặng');
        }
    };

    const saveSettings = async () => {
        const heightVal = parseFloat(tempHeight);
        const targetVal = parseFloat(tempTarget);
        const startVal = parseFloat(tempStart);

        if (!heightVal || heightVal <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập chiều cao hợp lệ');
            return;
        }
        if (!targetVal || targetVal <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập cân nặng mục tiêu hợp lệ');
            return;
        }
        if (!startVal || startVal <= 0) {
            Alert.alert('Lỗi', 'Vui lòng nhập cân nặng ban đầu hợp lệ');
            return;
        }

        try {
            await firebaseApi.updateUserSettings({
                height: heightVal,
                target_weight: targetVal,
                start_weight: startVal,
            });

            setHeight(heightVal);
            setTargetWeight(targetVal);
            setStartWeight(startVal);
            setEditingSettings(false);
            loadWeightData(); // Reload to recalculate BMI
            Alert.alert('Thành công', 'Đã cập nhật cài đặt');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu cài đặt');
        }
    };

    const progress = startWeight > 0 ? ((startWeight - currentWeight) / (startWeight - targetWeight) * 100) : 0;

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
                    <Text style={styles.weightValue}>{currentWeight}</Text>
                    <Text style={styles.weightUnit}>kg</Text>
                </View>

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

                <View style={styles.bmiCard}>
                    <Text style={styles.bmiLabel}>BMI</Text>
                    <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
                    <Text style={styles.bmiStatus}>
                        {bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì'}
                    </Text>
                </View>
            </LinearGradient>

            {/* Settings Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Cài đặt mục tiêu</Text>
                    <TouchableOpacity onPress={() => {
                        if (editingSettings) {
                            setEditingSettings(false);
                        } else {
                            setTempHeight(height.toString());
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
                            <Text style={styles.settingLabel}>Chiều cao (cm)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={tempHeight}
                                onChangeText={setTempHeight}
                                placeholder="170"
                                keyboardType="decimal-pad"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>
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
                            <Text style={styles.settingDisplayValue}>{height} cm</Text>
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
