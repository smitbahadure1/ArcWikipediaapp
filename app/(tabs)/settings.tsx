import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
    // State for toggles
    const [showLinkPreviews, setShowLinkPreviews] = useState(true);
    const [collapseTables, setCollapseTables] = useState(true);
    const [readingListSync, setReadingListSync] = useState(false);
    const [downloadReadingList, setDownloadReadingList] = useState(true);
    const [downloadWifiOnly, setDownloadWifiOnly] = useState(false);
    const [showImages, setShowImages] = useState(true);
    const [preferOffline, setPreferOffline] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const keys = [
                'showLinkPreviews', 'collapseTables', 'readingListSync',
                'downloadReadingList', 'downloadWifiOnly', 'showImages', 'preferOffline'
            ];
            const result = await AsyncStorage.multiGet(keys);

            result.forEach(([key, value]) => {
                if (value !== null) {
                    const boolValue = value === 'true';
                    switch (key) {
                        case 'showLinkPreviews': setShowLinkPreviews(boolValue); break;
                        case 'collapseTables': setCollapseTables(boolValue); break;
                        case 'readingListSync': setReadingListSync(boolValue); break;
                        case 'downloadReadingList': setDownloadReadingList(boolValue); break;
                        case 'downloadWifiOnly': setDownloadWifiOnly(boolValue); break;
                        case 'showImages': setShowImages(boolValue); break;
                        case 'preferOffline': setPreferOffline(boolValue); break;
                    }
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    const toggleSwitch = async (key: string, setter: any, value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newValue = !value;
        setter(newValue);
        try {
            await AsyncStorage.setItem(key, String(newValue));
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenLink = async (url: string) => {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Error", "Check your internet connection.");
        }
    };

    const showNotImplemented = (feature: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(feature, "This feature is coming soon to Arc.");
    };

    const handleClearDonationHistory = () => {
        Alert.alert(
            "Clear Donation History",
            "Are you sure you want to clear your donation history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        Alert.alert("Success", "Donation history cleared.");
                    }
                }
            ]
        );
    };

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderItem = (title: string, subtitle?: string, hasSwitch?: boolean, switchValue?: boolean, switchKey?: string, switchSetter?: any, hasLinkIcon?: boolean, onPress?: () => void) => (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress} disabled={hasSwitch}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            {hasSwitch && (
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(switchKey!, switchSetter, switchValue || false)}
                    value={switchValue}
                />
            )}
            {hasLinkIcon && (
                <Ionicons name="open-outline" size={20} color="#9aa0a6" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {renderSectionHeader("General")}
                {renderItem("Arc languages", "English", false, undefined, undefined, undefined, false, () => showNotImplemented("Languages"))}
                {renderItem("Explore feed", "Customize the Explore feed", false, undefined, undefined, undefined, false, () => showNotImplemented("Explore Feed"))}
                {renderItem("Show link previews", "Show a quick preview of articles when tapping on links.", true, showLinkPreviews, 'showLinkPreviews', setShowLinkPreviews)}
                {renderItem("Collapse tables", "Automatically collapse tables in articles, such as infoboxes, references, and notes.", true, collapseTables, 'collapseTables', setCollapseTables)}
                {renderItem("App theme", "Black", false, undefined, undefined, undefined, false, () => showNotImplemented("Theming"))}

                {renderSectionHeader("Recommendations")}
                {renderItem("Discover reading list", "Discover is off. Arc won't recommend you articles to read.", false, undefined, undefined, undefined, false, () => showNotImplemented("Discover Reading List"))}

                {renderSectionHeader("Donations")}
                {renderItem("Clear donation history", undefined, false, undefined, undefined, undefined, false, handleClearDonationHistory)}

                {renderSectionHeader("Syncing")}
                {renderItem("Reading list syncing", "Sync reading lists across different devices by saving them to your Wikipedia account", true, readingListSync, 'readingListSync', setReadingListSync)}
                {renderItem("Download reading list articles", undefined, true, downloadReadingList, 'downloadReadingList', setDownloadReadingList)}

                {renderSectionHeader("Data usage")}
                {renderItem("Download only over Wi-Fi", undefined, true, downloadWifiOnly, 'downloadWifiOnly', setDownloadWifiOnly)}
                {renderItem("Show images", "Enable or disable loading of images in pages. Uncheck this setting if your Internet connection is slow, or if your data plan is limited.", true, showImages, 'showImages', setShowImages)}
                {renderItem("Prefer offline content", "Save data usage by loading articles that are available offline rather than always loading the latest version of an article", true, preferOffline, 'preferOffline', setPreferOffline)}

                {renderSectionHeader("About")}
                {renderItem("About Arc", undefined, false, undefined, undefined, undefined, false, () => Alert.alert("About Arc", "Version 1.0.0"))}
                {renderItem("Arc App FAQ", undefined, false, undefined, undefined, undefined, true, () => handleOpenLink("https://en.m.wikipedia.org/wiki/Wikipedia:FAQ/Readers"))}
                {renderItem("Privacy policy", undefined, false, undefined, undefined, undefined, true, () => handleOpenLink("https://foundation.wikimedia.org/wiki/Policy:Privacy_policy"))}
                {renderItem("Terms of use", undefined, false, undefined, undefined, undefined, true, () => handleOpenLink("https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use"))}
                {renderItem("Send app feedback", undefined, false, undefined, undefined, undefined, true, () => handleOpenLink("mailto:android-support@wikimedia.org"))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#202124',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 16,
        color: '#8ab4f8',
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 16,
        fontWeight: '600',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    itemTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#9aa0a6',
        lineHeight: 20,
    },
});
