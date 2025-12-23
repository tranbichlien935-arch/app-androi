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
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function WeightScreen() {
    const [showAddWeight, setShowAddWeight] = useState(false);

    const weightHistory = [
        { date: '01/12', weight: 70.5 },
        { date: '05/12', weight: 70.2 },
        { date: '08/12', weight: 69.8 },
        { date: '12/12', weight: 69.5 },
        { date: '15/12', weight: 69.2 },
        { date: '18/12', weight: 68.9 },
        { date: '23/12', weight: 68.5 },
    ];

    const currentWeight = 68.5;
    const targetWeight = 65.0;
    const startWeight = 70.5;
    const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;

    const stats = {
        bmi: 22.4,
        lost: startWeight - currentWeight,
        remaining: currentWeight - targetWeight,
        avgWeekly: 0.3,
    };

    const milestones = [
        { weight: 70, achieved: true, date: '01/12' },
        { weight: 69, achieved: true, date: '12/12' },
        { weight: 68, achieved: true, date: '23/12' },
        { weight: 67, achieved: false, date: null },
        { weight: 66, achieved: false, date: null },
        { weight: 65, achieved: false, date: null },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Current Weight Card */}
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

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Bắt đầu</Text>
                        <Text style={styles.statValue}>{startWeight}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Đã giảm</Text>
                        <Text style={styles.statValue}>-{stats.lost.toFixed(1)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Mục tiêu</Text>
                        <Text style={styles.statValue}>{targetWeight}</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Tiến độ</Text>
                        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        Còn {stats.remaining.toFixed(1)} kg nữa để đạt mục tiêu
                    </Text>
                </View>
            </LinearGradient>

            {/* BMI Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Chỉ số BMI</Text>
                <View style={styles.bmiRow}>
                    <View>
                        <Text style={styles.bmiValue}>{stats.bmi}</Text>
                        <Text style={styles.bmiLabel}>Bình thường</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.heightLabel}>Chiều cao</Text>
                        <Text style={styles.heightValue}>175 cm</Text>
                    </View>
                </View>
            </View>

            {/* Weight Chart */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                        <Ionicons name="trending-down" size={20} color={Colors.green[600]} />
                        <Text style={styles.cardTitle}>Biểu đồ cân nặng</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowAddWeight(true)}
                        style={styles.addButton}
                    >
                        <Ionicons name="add" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <LineChart
                    data={{
                        labels: weightHistory.map((item) => item.date),
                        datasets: [{ data: weightHistory.map((item) => item.weight) }],
                    }}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={{
                        backgroundColor: Colors.white,
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '4',
                            strokeWidth: '2',
                            stroke: Colors.green[600],
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* Milestones */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="flag" size={20} color={Colors.green[600]} />
                    <Text style={styles.cardTitle}>Cột mốc quan trọng</Text>
                </View>
                <View style={styles.milestoneList}>
                    {milestones.map((milestone, index) => (
                        <View
                            key={index}
                            style={[
                                styles.milestoneItem,
                                milestone.achieved ? styles.milestoneAchieved : styles.milestonePending,
                            ]}
                        >
                            <View
                                style={[
                                    styles.milestoneIcon,
                                    milestone.achieved
                                        ? styles.milestoneIconAchieved
                                        : styles.milestoneIconPending,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.milestoneIconText,
                                        milestone.achieved && styles.milestoneIconTextAchieved,
                                    ]}
                                >
                                    {milestone.achieved ? '✓' : milestone.weight}
                                </Text>
                            </View>
                            <View style={styles.milestoneInfo}>
                                <Text
                                    style={[
                                        styles.milestoneWeight,
                                        milestone.achieved && styles.milestoneWeightAchieved,
                                    ]}
                                >
                                    {milestone.weight} kg
                                </Text>
                                {milestone.achieved && milestone.date && (
                                    <Text style={styles.milestoneDate}>Đạt được: {milestone.date}</Text>
                                )}
                            </View>
                            {milestone.achieved && <Text style={styles.milestoneEmoji}>🎉</Text>}
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
        marginBottom: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
    },
    weightDisplay: {
        alignItems: 'center',
        marginBottom: 24,
    },
    weightValue: {
        fontSize: 64,
        fontWeight: '600',
        color: Colors.white,
    },
    weightUnit: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.9)',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
        marginTop: 4,
    },
    progressCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
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
    progressPercent: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 6,
    },
    progressText: {
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
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    addButton: {
        backgroundColor: Colors.green[600],
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bmiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bmiValue: {
        fontSize: 40,
        fontWeight: '600',
        color: Colors.green[600],
    },
    bmiLabel: {
        fontSize: 14,
        color: Colors.green[600],
        marginTop: 4,
    },
    heightLabel: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    heightValue: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.gray[900],
        marginTop: 4,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    milestoneList: {
        gap: 12,
    },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    milestoneAchieved: {
        backgroundColor: Colors.green[50],
        borderColor: Colors.green[200],
    },
    milestonePending: {
        backgroundColor: Colors.gray[50],
        borderColor: Colors.gray[200],
    },
    milestoneIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    milestoneIconAchieved: {
        backgroundColor: Colors.green[600],
    },
    milestoneIconPending: {
        backgroundColor: Colors.gray[300],
    },
    milestoneIconText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray[600],
    },
    milestoneIconTextAchieved: {
        color: Colors.white,
    },
    milestoneInfo: {
        flex: 1,
    },
    milestoneWeight: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    milestoneWeightAchieved: {
        color: Colors.gray[900],
    },
    milestoneDate: {
        fontSize: 12,
        color: Colors.green[600],
        marginTop: 2,
    },
    milestoneEmoji: {
        fontSize: 24,
    },
});
