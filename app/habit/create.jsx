import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FrequencySelector } from '@/components/ui/FrequencySelector';
import { useHabits } from '@/contexts/HabitContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateHabitScreen() {
    const router = useRouter();
    const { addHabit } = useHabits();
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');

    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [reminderTime, setReminderTime] = useState();
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempTime, setTempTime] = useState(new Date());

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a habit name');
            return;
        }

        if (frequency === 'weekly' && selectedDays.length === 0) {
            Alert.alert('Error', 'Please select at least one day');
            return;
        }

        try {
            await addHabit({
                name: name.trim(),
                frequency,
                selectedDays: frequency === 'weekly' ? selectedDays : undefined,
                reminderTime,
            });

            Alert.alert('Success', 'Habit created successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create habit');
        }
    };

    const handleTimeChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }

        if (selectedDate) {
            setTempTime(selectedDate);
            const hours = selectedDate.getHours().toString().padStart(2, '0');
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            setReminderTime(`${hours}:${minutes}`);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ThemedText style={styles.label}>Habit Name *</ThemedText>
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: '#e2e8f0' }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Drink 2L water, Read 30 mins"
                    placeholderTextColor="#94a3b8"
                />

                <FrequencySelector
                    frequency={frequency}
                    selectedDays={selectedDays}
                    onFrequencyChange={setFrequency}
                    onDaysChange={setSelectedDays}
                />

                <View style={styles.reminderSection}>
                    <ThemedText style={styles.label}>Reminder Time (Optional)</ThemedText>
                    <TouchableOpacity
                        style={[styles.timeButton, { borderColor: '#e2e8f0' }]}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <ThemedText style={styles.timeText}>
                            {reminderTime || 'No reminder set'}
                        </ThemedText>
                    </TouchableOpacity>

                    {showTimePicker && (
                        <DateTimePicker
                            value={tempTime}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: '#2563eb' }]}
                    onPress={handleSave}
                >
                    <ThemedText style={styles.saveButtonText}>Create Habit</ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    reminderSection: {
        marginBottom: 24,
    },
    timeButton: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    timeText: {
        fontSize: 16,
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
