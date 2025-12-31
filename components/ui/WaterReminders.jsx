import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

/**
 * Component hiển thị danh sách nhắc nhở uống nước
 * @param {Object} props
 * @param {Array} props.reminders - Danh sách reminders
 * @param {function} props.onToggle - Callback khi toggle reminder
 */
export default function WaterReminders({ reminders: initialReminders = [], onToggle }) {
    const defaultReminders = [
        { id: 'wake_up', label: 'Sáu khi thức dậy', time: '7h00', enabled: false },
        { id: 'mid_morning', label: 'Giữa buổi sáng', time: '10h00', enabled: false },
        { id: 'before_lunch', label: 'Trước bữa trưa', time: '11h30', enabled: false },
        { id: 'mid_afternoon', label: 'Giữa buổi chiều', time: '15h00', enabled: false },
        { id: 'before_dinner', label: 'Trước bữa tối', time: '18h00', enabled: false },
        { id: 'before_sleep', label: 'Trước khi ngủ', time: '21h00', enabled: false },
    ];

    const [reminders, setReminders] = useState(
        initialReminders.length > 0 ? initialReminders : defaultReminders
    );

    useEffect(() => {
        if (initialReminders.length > 0) {
            setReminders(initialReminders);
        }
    }, [initialReminders]);

    const handleToggle = (id, value) => {
        const updatedReminders = reminders.map(reminder =>
            reminder.id === id ? { ...reminder, enabled: value } : reminder
        );
        setReminders(updatedReminders);
        onToggle?.(id, value, updatedReminders);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="notifications" size={20} color={Colors.gray[700]} />
                <Text style={styles.title}>Nhắc nhở uống nước</Text>
            </View>

            <View style={styles.remindersList}>
                {reminders.map((reminder) => (
                    <View key={reminder.id} style={styles.reminderItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="water"
                                size={20}
                                color={reminder.enabled ? Colors.blue[600] : Colors.gray[400]}
                            />
                        </View>
                        <View style={styles.reminderInfo}>
                            <Text style={styles.reminderLabel}>{reminder.label}</Text>
                            <Text style={styles.reminderTime}>{reminder.time}</Text>
                        </View>
                        <Switch
                            value={reminder.enabled}
                            onValueChange={(value) => handleToggle(reminder.id, value)}
                            trackColor={{ false: Colors.gray[200], true: Colors.blue[200] }}
                            thumbColor={reminder.enabled ? Colors.blue[600] : Colors.gray[400]}
                            ios_backgroundColor={Colors.gray[200]}
                        />
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
    remindersList: {
        gap: 12,
    },
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.blue[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reminderInfo: {
        flex: 1,
    },
    reminderLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.gray[900],
        marginBottom: 2,
    },
    reminderTime: {
        fontSize: 13,
        color: Colors.gray[500],
    },
});
