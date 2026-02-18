import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleFinish = async () => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
            router.replace('/(tabs)');
        } catch (e) {
            console.error(e);
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {step === 0 && (
                <>
                    {/* Background Watermarks */}
                    <View style={styles.watermarkContainer} pointerEvents="none">
                        <Text style={[styles.watermark, { top: '15%', left: '5%', fontSize: 32, transform: [{ rotate: '-15deg' }] }]}>阿克</Text>
                        <Text style={[styles.watermark, { top: '10%', right: '10%', fontSize: 24, transform: [{ rotate: '10deg' }] }]}>آرک</Text>
                        <Text style={[styles.watermark, { top: '30%', left: '-5%', fontSize: 40, opacity: 0.1 }]}>Arc</Text>
                        <Text style={[styles.watermark, { top: '25%', right: '5%', fontSize: 28, transform: [{ rotate: '-5deg' }] }]}>아크</Text>
                        <Text style={[styles.watermark, { top: '60%', left: '10%', fontSize: 36, transform: [{ rotate: '20deg' }] }]}>Aрк</Text>
                        <Text style={[styles.watermark, { top: '65%', right: '15%', fontSize: 30 }]}>आर्क</Text>
                        <Text style={[styles.watermark, { bottom: '20%', left: '20%', fontSize: 26, transform: [{ rotate: '-10deg' }] }]}>アーク</Text>
                        <Text style={[styles.watermark, { bottom: '15%', right: '-5%', fontSize: 34 }]}>Arc</Text>
                    </View>

                    {/* Center Content */}
                    <View style={styles.centerContent}>
                        <Text style={styles.title}>ARC</Text>
                        <View style={styles.underline} />
                        <Text style={styles.subtitle}>The Free Knowledge</Text>
                    </View>

                    {/* Bottom Button */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Get started</Text>
                            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {step === 1 && (
                <>
                    <View style={styles.slideContent}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1024px-Wikipedia-logo-v2.svg.png' }}
                            style={styles.globeImage}
                            contentFit="contain"
                        />
                        <Text style={styles.slideTitle}>The free encyclopedia</Text>
                        <Text style={styles.slideText}>
                            Arc is written collaboratively by volunteers and consists of more than 40 million articles in over 300 languages.
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.slideLink}>Learn more about Arc</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={styles.footerButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <View style={styles.pagination}>
                            <View style={[styles.dot, { backgroundColor: '#3366cc' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <Text style={[styles.footerButtonText, { color: '#3366cc', fontWeight: 'bold' }]}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {step === 2 && (
                <>
                    <View style={styles.slideContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="telescope" size={100} color="#8ab4f8" />
                        </View>
                        <Text style={styles.slideTitle}>New ways to explore</Text>

                        <View style={styles.featureList}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureTitle}>Explore feed</Text>
                                <Text style={styles.featureDescription}>Recommended reading and daily articles from our community</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureTitle}>Places tab</Text>
                                <Text style={styles.featureDescription}>Discover landmarks near you or search for places across the world</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureTitle}>On this day</Text>
                                <Text style={styles.featureDescription}>Travel back in time to learn what happened today in history</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={styles.footerButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <View style={styles.pagination}>
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#3366cc' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <Text style={[styles.footerButtonText, { color: '#3366cc', fontWeight: 'bold' }]}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {step === 3 && (
                <>
                    <View style={styles.slideContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="bookmark-multiple" size={100} color="#8ab4f8" />
                        </View>
                        <Text style={styles.slideTitle}>Reading lists with sync</Text>
                        <Text style={styles.slideText}>
                            You can make reading lists for articles you want to read later, even when you're offline.
                            Login to your Arc account to sync your reading lists across devices.
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={styles.footerButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <View style={styles.pagination}>
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#3366cc' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <Text style={[styles.footerButtonText, { color: '#3366cc', fontWeight: 'bold' }]}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {step === 4 && (
                <>
                    <View style={styles.slideContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="shield-check" size={100} color="#8ab4f8" />
                        </View>
                        <Text style={styles.slideTitle}>Data & Privacy</Text>
                        <Text style={styles.slideText}>
                            We believe that you should not have to provide personal data to participate in the free knowledge movement.
                            Arc is built to be used without logging in.
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={styles.footerButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <View style={styles.pagination}>
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#333' }]} />
                            <View style={[styles.dot, { backgroundColor: '#3366cc' }]} />
                        </View>

                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={[styles.footerButtonText, { color: '#3366cc', fontWeight: 'bold' }]}>Get settled</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Dark mode background
    },
    watermarkContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    watermark: {
        position: 'absolute',
        color: '#ffffff',
        opacity: 0.05, // Very faint
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 48,
        fontFamily: 'serif', // Times New Roman style
        fontWeight: '400',
        color: '#ffffff',
        letterSpacing: 2,
        marginBottom: 4,
    },
    underline: {
        width: 60,
        height: 1,
        backgroundColor: '#ffffff',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#bdc1c6',
        fontStyle: 'italic',
    },
    bottomContainer: {
        padding: 24,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#3366cc', // Wikipedia blue-ish
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Slide 2 styles
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    globeImage: {
        width: 150,
        height: 150,
        marginBottom: 40,
        tintColor: '#bdc1c6' // Light grey tint for dark mode
    },
    iconContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'serif'
    },
    slideText: {
        fontSize: 16,
        color: '#bdc1c6',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    slideLink: {
        fontSize: 16,
        color: '#8ab4f8',
        fontWeight: '600',
    },
    featureList: {
        width: '100%',
        marginTop: 10,
    },
    featureItem: {
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 15,
        color: '#bdc1c6',
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 40,
    },
    footerButtonText: {
        fontSize: 16,
        color: '#bdc1c6',
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
