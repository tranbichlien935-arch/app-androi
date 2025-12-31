import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Component hiển thị các giai đoạn giấc ngủ
 * @param {Object} props
 * @param {number} props.deepSleep - Giờ ngủ sâu
 * @param {number} props.lightSleep - Giờ ngủ nông
 * @param {number} props.remSleep - Giờ REM
 */
export default function SleepStagesChart({ deepSleep = 0, lightSleep = 0, remSleep = 0 }) {
    const totalHours = deepSleep + lightSleep + remSleep;

    // Tính phần trăm
    const deepPercent = totalHours > 0 ? Math.round((deepSleep / totalHours) * 100) : 0;
    const lightPercent = totalHours > 0 ? Math.round((lightSleep / totalHours) * 100) : 0;
    const remPercent = totalHours > 0 ? Math.round((remSleep / totalHours) * 100) : 0;

    const stages = [
        {
            icon: 'moon',
            label: 'Ngủ sâu',
            hours: deepSleep,
            percent: deepPercent,
            color: Colors.blue[500],
            bgColor: Colors.blue[50],
        },
        {
            icon: 'cloudy-night',
            label: 'Ngủ nông',
            hours: lightSleep,
            percent: lightPercent,
            color: Colors.green[500],
            bgColor: Colors.green[50],
        },
        {
            icon: 'flash',
            label: 'REM',
            hours: remSleep,
            percent: remPercent,
            color: Colors.purple[500],
            bgColor: Colors.purple[50],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="bar-chart" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Giai đoạn giấc ngủ</Text>
            </View>

            <View style={styles.stagesContainer}>
                {stages.map((stage, index) => (
                    <View key={index} style={styles.stageRow}>
                        <View style={styles.stageInfo}>
                            <View style={[styles.iconContainer, { backgroundColor: stage.bgColor }]}>
                                <Ionicons name={stage.icon} size={20} color={stage.color} />
                            </View>
                            <View style={styles.stageLabels}>
                                <Text style={styles.stageLabel}>{stage.label}</Text>
                                <Text style={styles.stageValue}>
                                    {stage.hours.toFixed(1)}h
                                    <Text style={styles.stagePercent}> ({stage.percent}%)</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${stage.percent}%`,
                                            backgroundColor: stage.color,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginTop: 0,
        shadowColor: Colors.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
    },
    stagesContainer: {
        gap: 12,
    },
    stageRow: {
        gap: 8,
    },
    stageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 6,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stageLabels: {
        flex: 1,
    },
    stageLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray[900],
        marginBottom: 2,
    },
    stageValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[700],
    },
    stagePercent: {
        fontSize: 13,
        fontWeight: '400',
        color: Colors.gray[500],
    },
    progressBarContainer: {
        paddingLeft: 52,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: Colors.gray[100],
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
