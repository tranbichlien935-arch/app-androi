import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        if (!agreedToTerms) {
            alert('Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Sign up:', { fullName, email, password });
        setIsLoading(false);
        // TODO: Navigate after successful registration
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo/Brand Area */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={Colors.gradient.blue}
                        style={styles.logoContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="person" size={32} color={Colors.white} />
                    </LinearGradient>
                    <Text style={styles.title}>Tạo tài khoản</Text>
                    <Text style={styles.subtitle}>Đăng ký để bắt đầu</Text>
                </View>

                {/* Sign Up Form */}
                <View style={styles.formCard}>
                    {/* Full Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Họ và tên</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={Colors.slate[400]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Nguyễn Văn A"
                                placeholderTextColor={Colors.slate[400]}
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={Colors.slate[400]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="email@example.com"
                                placeholderTextColor={Colors.slate[400]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={Colors.slate[400]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.slate[400]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={Colors.slate[400]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={Colors.slate[400]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.slate[400]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={Colors.slate[400]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Terms and Conditions */}
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setAgreedToTerms(!agreedToTerms)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                agreedToTerms && styles.checkboxChecked,
                            ]}
                        >
                            {agreedToTerms && (
                                <Ionicons name="checkmark" size={16} color={Colors.white} />
                            )}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            Tôi đồng ý với{' '}
                            <Text style={styles.link}>Điều khoản dịch vụ</Text> và{' '}
                            <Text style={styles.link}>Chính sách bảo mật</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={Colors.gradient.blue}
                            style={styles.submitButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {isLoading ? (
                                <Text style={styles.submitButtonText}>Đang xử lý...</Text>
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Đăng ký</Text>
                                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Sign In Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => router.push('/sign-in')}>
                        <Text style={styles.footerLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
        paddingVertical: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.slate[900],
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.slate[600],
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 32,
        shadowColor: Colors.slate[200],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.slate[700],
        marginBottom: 8,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: Colors.slate[50],
        borderWidth: 1,
        borderColor: Colors.slate[200],
        borderRadius: 12,
        paddingLeft: 48,
        paddingRight: 16,
        fontSize: 16,
        color: Colors.slate[900],
    },
    inputWithIcon: {
        paddingRight: 48,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.slate[300],
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: Colors.blue[600],
        borderColor: Colors.blue[600],
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: Colors.slate[600],
        lineHeight: 20,
    },
    link: {
        color: Colors.blue[600],
        fontWeight: '600',
    },
    submitButton: {
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.blue[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 16,
        color: Colors.slate[600],
    },
    footerLink: {
        fontSize: 16,
        color: Colors.blue[600],
        fontWeight: '600',
    },
});
