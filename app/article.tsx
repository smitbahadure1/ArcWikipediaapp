import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Linking } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Helper to strip HTML tags
const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};

export default function ArticleScreen() {
    const { title } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!title) return;

        const fetchArticle = async () => {
            try {
                setLoading(true);
                // Clean title for API: spaces to underscores
                const apiTitle = encodeURIComponent(String(title).replace(/ /g, '_'));
                const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${apiTitle}`;

                // Handle CORS for Web if needed, but standard summary endpoint usually works or fails gracefully
                // We will try direct first

                let headers: any = {
                    'Accept': 'application/json'
                };
                if (Platform.OS === 'web') {
                    headers['Api-User-Agent'] = 'WikipediaAppClone/1.0 (https://example.org/my-cool-app; my@email.com)';
                } else {
                    headers['User-Agent'] = 'WikipediaAppClone/1.0 (https://example.org/my-cool-app; my@email.com)';
                }

                let response = null;
                try {
                    response = await fetch(url, { headers });
                    if (!response.ok && Platform.OS === 'web') {
                        // Try proxy if direct fails
                        console.log("Direct article fetch failed, trying proxy...");
                        // Note: Proxy might not be needed if we assume fallback behavior, but let's try direct first
                    }
                } catch (e) {
                    console.log("Fetch error", e);
                }

                if (!response || !response.ok) {
                    // Fallback or error
                    // If we really can't get data, we might just throw or show basic info passed in params?
                    // For now, let's just assume we can fetch or display error.
                    throw new Error("Could not fetch article details.");
                }

                const json = await response.json();
                setData(json);
            } catch (err: any) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        checkIfSaved();
    }, [title]);

    const checkIfSaved = async () => {
        try {
            const saved = await AsyncStorage.getItem('saved_articles');
            if (saved) {
                const articles = JSON.parse(saved);
                const exists = articles.find((a: any) => a.title === title);
                setIsSaved(!!exists);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleSave = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            const saved = await AsyncStorage.getItem('saved_articles');
            let articles = saved ? JSON.parse(saved) : [];

            if (isSaved) {
                // Remove
                articles = articles.filter((a: any) => a.title !== title);
            } else {
                // Add
                if (data) {
                    articles.unshift({
                        title: data.title || title,
                        displaytitle: data.displaytitle,
                        description: data.description,
                        thumbnail: data.thumbnail
                    });
                }
            }

            await AsyncStorage.setItem('saved_articles', JSON.stringify(articles));
            setIsSaved(!isSaved);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenBrowser = async () => {
        if (!data) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        const url = data.content_urls?.desktop?.page || data.content_urls?.mobile?.page || `https://en.wikipedia.org/wiki/${title}`;
        await WebBrowser.openBrowserAsync(url);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#ffffff" />
            </SafeAreaView>
        );
    }

    if (errorMsg || !data) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>Failed to load article</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header Image */}
                {data.originalimage && (
                    <Image
                        source={{ uri: data.originalimage.source }}
                        style={styles.image}
                        contentFit="cover"
                    />
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{stripHtml(data.displaytitle)}</Text>
                    <Text style={styles.description}>{data.description}</Text>
                    <Text style={styles.extract}>{data.extract}</Text>

                    <TouchableOpacity style={styles.browserButton} onPress={handleOpenBrowser}>
                        <Text style={styles.browserButtonText}>Read full article on Arc</Text>
                        <Ionicons name="open-outline" size={20} color="#8ab4f8" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Back Button */}
            <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.floatingSaveButton} onPress={toggleSave}>
                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 300,
    },
    textContainer: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        fontFamily: 'serif',
    },
    description: {
        fontSize: 16,
        color: '#bdc1c6',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    extract: {
        fontSize: 18,
        color: '#e8eaed',
        lineHeight: 28,
        marginBottom: 30,
    },
    browserButton: {
        flexDirection: 'row',
        backgroundColor: '#303134',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    browserButtonText: {
        color: '#8ab4f8',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#303134',
        borderRadius: 8
    },
    backButtonText: {
        color: 'white'
    },
    floatingBackButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingSaveButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
