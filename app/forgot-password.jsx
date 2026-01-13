import { Colors } from '@/constants/Colors';
import firebaseApi from '@/services/firebase-api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }

        setIsLoading(true);
        try {
            await firebaseApi.resetPassword(email);
            setEmailSent(true);
            Alert.alert(
                'Thành công',
                'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Lỗi', error.message || 'Không thể gửi email đặt lại mật khẩu');
        } finally {
            setIsLoading(false);
        }
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
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.gray[900]} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={Colors.gradient.blue}
                        style={styles.logoContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="mail" size={32} color={Colors.white} />
                    </LinearGradient>
                    <Text style={styles.title}>Quên mật khẩu?</Text>
                    <Text style={styles.subtitle}>
                        Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
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
                                editable={!emailSent}
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading || emailSent}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={emailSent ? [Colors.gray[400], Colors.gray[500]] : Colors.gradient.blue}
                            style={styles.submitButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {isLoading ? (
                                <Text style={styles.submitButtonText}>Đang gửi...</Text>
                            ) : emailSent ? (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                                    <Text style={styles.submitButtonText}>Đã gửi email</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Gửi email</Text>
                                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Help Text */}
                    <View style={styles.helpBox}>
                        <Ionicons name="information-circle" size={20} color={Colors.blue[600]} />
                        <Text style={styles.helpText}>
                            Email có thể mất vài phút để đến. Vui lòng kiểm tra cả thư mục spam.
                        </Text>
                    </View>
                </View>

                {/* Back to Sign In */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Nhớ mật khẩu rồi? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
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
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: Colors.blue[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.gray[900],
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.gray[600],
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray[700],
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.slate[50],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.slate[200],
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 52,
        fontSize: 15,
        color: Colors.gray[900],
    },
    submitButton: {
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    helpBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.blue[50],
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    helpText: {
        flex: 1,
        fontSize: 13,
        color: Colors.blue[700],
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.blue[600],
    },
});
