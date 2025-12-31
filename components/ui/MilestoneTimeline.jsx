import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function MilestoneTimeline({ milestones }) {
    if (!milestones || milestones.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎯 Cột mốc quan trọng</Text>

            <View style={styles.timeline}>
                {milestones.map((milestone, index) => {
                    const isCompleted = milestone.completed;
                    const isLast = index === milestones.length - 1;

                    return (
                        <View key={index} style={styles.milestoneItem}>
                            {/* Timeline Line */}
                            {!isLast && (
                                <View
                                    style={[
                                        styles.timelineLine,
                                        {
                                            backgroundColor: isCompleted
                                                ? Colors.green[300]
                                                : Colors.gray[300],
                                        },
                                    ]}
                                />
                            )}

                            {/* Milestone Content */}
                            <View style={styles.milestoneContent}>
                                {/* Icon */}
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor: isCompleted
                                                ? Colors.green[600]
                                                : Colors.gray[300],
                                        },
                                    ]}
                                >
                                    {isCompleted ? (
                                        <Ionicons name="checkmark" size={20} color={Colors.white} />
                                    ) : (
                                        <View style={styles.emptyDot} />
                                    )}
                                </View>

                                {/* Info */}
                                <View style={styles.infoContainer}>
                                    <View style={styles.infoHeader}>
                                        <Text
                                            style={[
                                                styles.weightText,
                                                {
                                                    color: isCompleted
                                                        ? Colors.green[700]
                                                        : Colors.gray[700],
                                                },
                                            ]}
                                        >
                                            {milestone.weight} kg
                                        </Text>
                                        {isCompleted && (
                                            <Text style={styles.celebration}>🎉</Text>
                                        )}
                                    </View>

                                    <Text style={styles.dateText}>
                                        {isCompleted
                                            ? `Đạt được: ${milestone.date}`
                                            : `Dự đoán: ${milestone.estimatedDate || 'Đang tính...'}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray[900],
        marginBottom: 16,
    },
    timeline: {
        paddingLeft: 8,
    },
    milestoneItem: {
        position: 'relative',
        marginBottom: 24,
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 32,
        width: 2,
        height: '100%',
    },
    milestoneContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    emptyDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.white,
    },
    infoContainer: {
        flex: 1,
        paddingTop: 4,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    weightText: {
        fontSize: 16,
        fontWeight: '600',
    },
    celebration: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 13,
        color: Colors.gray[600],
    },
});
