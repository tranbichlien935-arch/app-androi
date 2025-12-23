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
    View
} from 'react-native';

export default function SleepScreen() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [totalHours, setTotalHours] = useState(0);
    const [quality, setQuality] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            loadSleepData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    const loadSleepData = async () => {
        try {
            const today = firebaseApi.getTodayDate();
            const sleepData = await firebaseApi.getSleepLogs(today);

            if (sleepData) {
                setBedTime(sleepData.bed_time || '23:00');
                setWakeTime(sleepData.wake_time || '07:00');
                setTotalHours(sleepData.total_hours || 0);
                setQuality(sleepData.quality || 0);
            }
        } catch (error) {
            console.error('Error loading sleep data:', error);
        } finally {
            setLoading(false);
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
            Alert.alert('Thành công', 'Đã lưu dữ liệu giấc ngủ');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu dữ liệu');
        }
    };

    return (
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
