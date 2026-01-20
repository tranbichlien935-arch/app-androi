import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

/**
 * Toast component - In-app notification banner
 * Dùng làm fallback khi không có notification permission
 */
export default function Toast({ visible, message, type = 'success', duration = 3000, onHide }) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    colors: ['#10b981', '#059669'],
                    iconColor: Colors.white,
                };
            case 'error':
                return {
                    icon: 'close-circle',
                    colors: ['#ef4444', '#dc2626'],
                    iconColor: Colors.white,
                };
            case 'warning':
                return {
                    icon: 'warning',
                    colors: ['#f59e0b', '#d97706'],
                    iconColor: Colors.white,
                };
            case 'info':
                return {
                    icon: 'information-circle',
                    colors: ['#3b82f6', '#2563eb'],
                    iconColor: Colors.white,
                };
            default:
                return {
                    icon: 'checkmark-circle',
                    colors: ['#10b981', '#059669'],
                    iconColor: Colors.white,
                };
        }
    };

    const config = getToastConfig();

    if (!visible && translateY._value === -100) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.toast}
            >
                <Ionicons name={config.icon} size={24} color={config.iconColor} />
                <Text style={styles.message}>{message}</Text>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
        lineHeight: 20,
    },
});
