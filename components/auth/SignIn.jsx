import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', 'Invalid email or password. Please sign up if you don\'t have an account.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.brand}>
                    <View style={styles.logo}><Feather name="target" size={28} color="white" /></View>
                    <ThemedText type="title" style={styles.title}>Chào mừng trở lại</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Đăng nhập để tiếp tục</ThemedText>
                </View>

                <ThemedView style={styles.form}>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="mail" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="email@example.com"
                            style={styles.input}
                        />
                    </View>

                    <ThemedText style={[styles.label, { marginTop: 12 }]}>Mật khẩu</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="lock" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
                            <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.submitContent}>
                                <ThemedText style={styles.submitText}>Đăng nhập</ThemedText>
                                <Feather name="arrow-right" size={18} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </ThemedView>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>Chưa có tài khoản? </ThemedText>
                    <Link href="/sign-up" style={styles.switchLink}>
                        <ThemedText style={{ color: '#2563eb' }}>Đăng ký ngay</ThemedText>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center' },
    box: { padding: 20 },
    brand: { alignItems: 'center', marginBottom: 20 },
    logo: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    title: { marginTop: 4 },
    subtitle: { marginTop: 4 },
    form: { borderRadius: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 4 },
    label: { marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, backgroundColor: '#f8fafc' },
    iconLeft: { marginLeft: 12, marginRight: 8 },
    iconRight: { padding: 12 },
    input: { flex: 1, paddingVertical: 10, paddingHorizontal: 8 },
    forgot: { color: '#2563eb' },
    submit: { marginTop: 16, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    submitContent: { flexDirection: 'row', alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: '600', marginRight: 8 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    footerText: { marginRight: 6 },
    switchLink: { color: '#2563eb' },
});
