import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function SleepScreen() {
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');

    const weeklyData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                data: [7.5, 6.5, 8.0, 7.0, 7.5, 8.5, 9.0],
            },
        ],
    };

    const todayStats = {
        hours: 7.5,
        quality: 85,
        deepSleep: 2.5,
        lightSleep: 4.0,
        rem: 1.0,
    };

    const sleepPhases = [
        {
            name: 'Ngủ sâu',
            hours: todayStats.deepSleep,
            color: Colors.indigo[600],
            percentage: (todayStats.deepSleep / todayStats.hours) * 100,
        },
        {
            name: 'Ngủ nông',
            hours: todayStats.lightSleep,
            color: Colors.blue[400],
            percentage: (todayStats.lightSleep / todayStats.hours) * 100,
        },
        {
            name: 'REM',
            hours: todayStats.rem,
            color: Colors.purple[400],
            percentage: (todayStats.rem / todayStats.hours) * 100,
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Sleep Summary Card */}
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
                    <View style={styles.summaryItem}>
                        <Ionicons name="moon" size={24} color="rgba(255,255,255,0.9)" />
                        <View>
                            <Text style={styles.summaryLabel}>Tổng thời gian</Text>
                            <Text style={styles.summaryValue}>{todayStats.hours}h</Text>
                        </View>
                    </View>
                    <View style={styles.summaryItem}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.summaryLabel}>Chất lượng</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={styles.summaryValue}>{todayStats.quality}</Text>
                                <Text style={styles.summaryUnit}>/100</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quality Bar */}
                <View style={styles.qualityBarBg}>
                    <View
                        style={[
                            styles.qualityBarFill,
                            { width: `${todayStats.quality}%` },
                        ]}
                    />
                </View>

                {/* Sleep/Wake Times */}
                <View style={styles.timesGrid}>
                    <View style={styles.timeBox}>
                        <Ionicons name="moon" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.timeLabel}>Giờ đi ngủ</Text>
                        <Text style={styles.timeValue}>{bedTime}</Text>
                    </View>
                    <View style={styles.timeBox}>
                        <Ionicons name="sunny" size={20} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.timeLabel}>Giờ thức dậy</Text>
                        <Text style={styles.timeValue}>{wakeTime}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Sleep Phases */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Giai đoạn giấc ngủ</Text>

                {/* Visual Timeline */}
                <View style={styles.phaseTimeline}>
                    {sleepPhases.map((phase, index) => (
                        <View
                            key={index}
                            style={[
                                styles.phaseBar,
                                { backgroundColor: phase.color, width: `${phase.percentage}%` },
                            ]}
                        >
                            <Text style={styles.phaseHours}>{phase.hours}h</Text>
                        </View>
                    ))}
                </View>

                {/* Phase Details */}
                <View style={styles.phaseList}>
                    {sleepPhases.map((phase, index) => (
                        <View key={index} style={styles.phaseItem}>
                            <View style={styles.phaseLeft}>
                                <View
                                    style={[styles.phaseDot, { backgroundColor: phase.color }]}
                                />
                                <Text style={styles.phaseName}>{phase.name}</Text>
                            </View>
                            <View style={styles.phaseRight}>
                                <Text style={styles.phaseValue}>{phase.hours}h</Text>
                                <Text style={styles.phasePercent}>
                                    ({Math.round(phase.percentage)}%)
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Weekly Chart */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="trending-up" size={20} color={Colors.indigo[600]} />
                    <Text style={styles.cardTitle}>Lịch sử tuần</Text>
                </View>
                <LineChart
                    data={weeklyData}
                    width={screenWidth - 64}
                    height={200}
                    chartConfig={{
                        backgroundColor: Colors.white,
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '4',
                            strokeWidth: '2',
                            stroke: Colors.indigo[600],
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
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
        shadowColor: Colors.indigo[500],
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
    sleepSummary: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.white,
    },
    summaryUnit: {
        fontSize: 14,
        color: Colors.white,
        marginLeft: 4,
    },
    qualityBarBg: {
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    qualityBarFill: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 6,
    },
    timesGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    timeBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 8,
    },
    timeValue: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
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
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 16,
    },
    phaseTimeline: {
        flexDirection: 'row',
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    phaseBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    phaseHours: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
    },
    phaseList: {
        gap: 12,
    },
    phaseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    phaseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    phaseDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    phaseName: {
        fontSize: 14,
        color: Colors.gray[700],
    },
    phaseRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    phaseValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    phasePercent: {
        fontSize: 12,
        color: Colors.gray[500],
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
