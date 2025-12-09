import { DAYS_OF_WEEK } from '@/constants/habits';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Frequency } from '@/types/habit';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FrequencySelector = ({
    frequency,
    selectedDays = [],
    onFrequencyChange,
    onDaysChange,
}) => {
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');

    const toggleDay = (dayValue: number) => {
        if (selectedDays.includes(dayValue)) {
            onDaysChange(selectedDays.filter(d => d !== dayValue));
        } else {
            onDaysChange([...selectedDays, dayValue].sort());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: textColor }]}>Frequency</Text>

            <View style={styles.frequencyOptions}>
                <TouchableOpacity
                    style={[
                        styles.frequencyButton,
                        frequency === 'daily' && { backgroundColor: tintColor },
                    ]}
                    onPress={() => onFrequencyChange('daily')}
                >
                    <Text style={[
                        styles.frequencyText,
                        frequency === 'daily' && styles.frequencyTextActive,
                    ]}>
                        Daily
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.frequencyButton,
                        frequency === 'weekly' && { backgroundColor: tintColor },
                    ]}
                    onPress={() => onFrequencyChange('weekly')}
                >
                    <Text style={[
                        styles.frequencyText,
                        frequency === 'weekly' && styles.frequencyTextActive,
                    ]}>
                        Specific Days
                    </Text>
                </TouchableOpacity>
            </View>

            {frequency === 'weekly' && (
                <View style={styles.daysContainer}>
                    <Text style={[styles.daysLabel, { color: textColor }]}>Select Days</Text>
                    <View style={styles.daysGrid}>
                        {DAYS_OF_WEEK.map(day => {
                            const isSelected = selectedDays.includes(day.value);
                            return (
                                <TouchableOpacity
                                    key={day.value}
                                    style={[
                                        styles.dayButton,
                                        isSelected && { backgroundColor: tintColor },
                                    ]}
                                    onPress={() => toggleDay(day.value)}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        isSelected && styles.dayTextActive,
                                    ]}>
                                        {day.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    frequencyOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    frequencyButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
    },
    frequencyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    frequencyTextActive: {
        color: '#fff',
    },
    daysContainer: {
        marginTop: 16,
    },
    daysLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    dayTextActive: {
        color: '#fff',
    },
});

