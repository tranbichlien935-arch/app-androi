import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const success = await signup(email, password, fullName);
            if (success) {
                Alert.alert('Success', 'Account created successfully!', [
                    { text: 'OK', onPress: () => router.replace('/(tabs)') }
                ]);
            } else {
                Alert.alert('Error', 'An account already exists. Please sign in instead.');
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
                    <View style={styles.logo}><Feather name="user-plus" size={28} color="white" /></View>
                    <ThemedText type="title" style={styles.title}>Tạo tài khoản</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Đăng ký để bắt đầu</ThemedText>
                </View>

                <ThemedView style={styles.form}>
                    <ThemedText style={styles.label}>Họ và tên</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="user" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput value={fullName} onChangeText={setFullName} placeholder="Nguyễn Văn A" style={styles.input} />
                    </View>

                    <ThemedText style={[styles.label, { marginTop: 12 }]}>Email</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="mail" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="email@example.com" style={styles.input} />
                    </View>

                    <ThemedText style={[styles.label, { marginTop: 12 }]}>Mật khẩu</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="lock" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="••••••••" style={styles.input} />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}><Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#94a3b8" /></TouchableOpacity>
                    </View>

                    <ThemedText style={[styles.label, { marginTop: 12 }]}>Xác nhận mật khẩu</ThemedText>
                    <View style={styles.inputRow}>
                        <Feather name="lock" size={18} color="#94a3b8" style={styles.iconLeft} />
                        <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} placeholder="••••••••" style={styles.input} />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconRight}><Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color="#94a3b8" /></TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : (
                            <View style={styles.submitContent}><ThemedText style={styles.submitText}>Đăng ký</ThemedText><Feather name="arrow-right" size={18} color="white" /></View>
                        )}
                    </TouchableOpacity>
                </ThemedView>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>Đã có tài khoản? </ThemedText>
                    <Link href="/sign-in" style={styles.switchLink}><ThemedText style={{ color: '#2563eb' }}>Đăng nhập</ThemedText></Link>
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
    termsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 12 },
    checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
    termsText: { flex: 1, marginLeft: 8 },
    submit: { marginTop: 16, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    submitContent: { flexDirection: 'row', alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: '600', marginRight: 8 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    footerText: { marginRight: 6 },
    switchLink: { color: '#2563eb' },
});
