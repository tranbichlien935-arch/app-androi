import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Animate entrance
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGetStarted = async () => {
        try {
            console.log('Get Started button pressed!');
            await AsyncStorage.setItem('hasSeenWelcome', 'true');
            console.log('Navigating to sign-in...');
            router.push('/sign-in');
        } catch (error) {
            console.error('Error:', error);
            router.push('/sign-in');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#FFB6D9', '#C9A0DC', '#A8D8EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />

            {/* Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
                pointerEvents="box-none"
            >
                {/* Logo Icon */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <Ionicons name="heart-circle" size={120} color="#FFFFFF" />
                    </View>
                </View>

                {/* App Name */}
                <Animated.View
                    style={[
                        styles.titleContainer,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                    pointerEvents="box-none"
                >
                    <Text style={styles.appName}>HEALIO</Text>
                    <View style={styles.underline} />
                </Animated.View>

                {/* Tagline */}
                <Animated.Text
                    style={[
                        styles.tagline,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    Your Personal Health Companion
                </Animated.Text>

                {/* Features */}
                <Animated.View
                    style={[
                        styles.featuresContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                    pointerEvents="box-none"
                >
                    <FeatureItem icon="fitness" text="Track Your Activities" />
                    <FeatureItem icon="nutrition" text="Monitor Nutrition" />
                    <FeatureItem icon="analytics" text="Analyze Progress" />
                </Animated.View>
            </Animated.View>

            {/* Get Started Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#FFFFFF', '#F0F0F0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={24} color="#C9A0DC" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
                <Ionicons name={icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C9A0DC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -100,
        right: -100,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: 100,
        left: -50,
    },
    circle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        top: height / 2,
        right: 20,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoBackground: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    appName: {
        fontSize: 56,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 100,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        marginTop: 10,
    },
    tagline: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 50,
        opacity: 0.9,
        fontWeight: '300',
        letterSpacing: 0.5,
    },
    featuresContainer: {
        width: '100%',
        marginTop: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    featureIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    featureText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 30,
        right: 30,
        zIndex: 1000, // Ensure button is on top
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#C9A0DC',
        marginRight: 10,
        letterSpacing: 1,
    },
});
