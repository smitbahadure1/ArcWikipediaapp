import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem('search_history');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    };

    const addToHistory = async (item: any) => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            const newHistory = [item, ...history.filter(h => h.title !== item.title)].slice(0, 20);
            setHistory(newHistory);
            await AsyncStorage.setItem('search_history', JSON.stringify(newHistory));
            router.push({ pathname: '/article', params: { title: item.title } });
        } catch (e) {
            console.error('Failed to save history', e);
            router.push({ pathname: '/article', params: { title: item.title } });
        }
    };

    const clearHistory = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            await AsyncStorage.removeItem('search_history');
            setHistory([]);
        } catch (e) {
            console.error('Failed to clear history', e);
        }
    };

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                // Using OpenSearch API for suggestions
                const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=20&namespace=0&format=json&origin=*`;

                let headers: any = {
                    'Accept': 'application/json'
                };

                if (Platform.OS === 'web') {
                    headers['Api-User-Agent'] = 'WikipediaAppClone/1.0 (https://example.org/my-cool-app; my@email.com)';
                } else {
                    headers['User-Agent'] = 'WikipediaAppClone/1.0 (https://example.org/my-cool-app; my@email.com)';
                }

                let response = null;
                let data = null;

                try {
                    response = await fetch(url, { headers });
                    if (!response.ok) throw new Error('Request failed');
                    const text = await response.text();
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        // If direct parse fails, it might be an HTML error page. throw to trigger proxy
                        throw new Error('Invalid JSON');
                    }
                } catch (err) {
                    console.log("Direct search failed", err);
                    if (Platform.OS === 'web') {
                        try {
                            console.log("Trying Proxy due to failure...");
                            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                            response = await fetch(proxyUrl);
                            data = await response.json();
                        } catch (proxyErr) {
                            console.error("Proxy search failed", proxyErr);
                        }
                    }
                }

                if (!data) {
                    // No data even after proxy
                    return;
                }

                // Opensearch returns [query, [titles], [descriptions], [urls]]
                // We will map this to an array of objects
                const titles = data[1];
                const descriptions = data[2];
                const urls = data[3];

                const searchResults = titles.map((title: string, index: number) => ({
                    title,
                    description: descriptions[index],
                    url: urls[index]
                }));

                setResults(searchResults);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Text style={styles.title}>Search</Text>

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9aa0a6" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Arc"
                        placeholderTextColor="#9aa0a6"
                        value={query}
                        onChangeText={setQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {query.length > 0 ? (
                        <TouchableOpacity onPress={handleClear}>
                            <Ionicons name="close-circle" size={20} color="#9aa0a6" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <Ionicons name="mic" size={20} color="#9aa0a6" />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="small" color="#8ab4f8" />
                    </View>
                ) : query.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.title}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.resultItem}
                                onPress={() => addToHistory(item)}
                            >
                                <View style={styles.resultIcon}>
                                    <Ionicons name="document-text-outline" size={24} color="#9aa0a6" />
                                </View>
                                <View style={styles.resultTextContainer}>
                                    <Text style={styles.resultTitle}>{item.title}</Text>
                                    <Text style={styles.resultDescription} numberOfLines={2}>{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.centered}>
                                <Text style={styles.emptySubtitle}>No results found.</Text>
                            </View>
                        }
                    />
                ) : (
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>History</Text>
                            {history.length > 0 && (
                                <TouchableOpacity onPress={clearHistory}>
                                    <Text style={{ color: '#8ab4f8', fontSize: 16 }}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {history.length > 0 ? (
                            <FlatList
                                data={history}
                                keyExtractor={(item) => item.title}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.resultItem}
                                        onPress={() => addToHistory(item)}
                                    >
                                        <View style={styles.resultIcon}>
                                            <Ionicons name="time-outline" size={24} color="#9aa0a6" />
                                        </View>
                                        <View style={styles.resultTextContainer}>
                                            <Text style={styles.resultTitle}>{item.title}</Text>
                                            <Text style={styles.resultDescription} numberOfLines={2}>{item.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="file-clock-outline" size={80} color="#5f6368" />
                                </View>
                                <Text style={styles.emptyTitle}>No recently viewed articles</Text>
                                <Text style={styles.emptySubtitle}>Track what you've been reading here.</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    title: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#202124',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        marginRight: 12,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
    },
    iconContainer: {
        marginBottom: 24,
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        backgroundColor: 'transparent'
    },
    emptyTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#9aa0a6',
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#202124',
    },
    resultIcon: {
        marginRight: 16,
        width: 32,
        alignItems: 'center',
    },
    resultTextContainer: {
        flex: 1,
    },
    resultTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    resultDescription: {
        color: '#9aa0a6',
        fontSize: 14,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40
    }
});
