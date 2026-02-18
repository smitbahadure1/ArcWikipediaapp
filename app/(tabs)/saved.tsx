import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

// Helper to strip HTML tags
const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export default function SavedScreen() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSavedArticles();
    }, [])
  );

  const loadSavedArticles = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_articles');
      if (saved) {
        setSavedArticles(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {savedArticles.length > 0 ? (
        <FlatList
          data={savedArticles}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleItem}
              onPress={() => router.push({ pathname: '/article', params: { title: item.title } })}
            >
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail.source }} style={styles.thumbnail} />
              ) : (
                <View style={styles.placeholderThumbnail}>
                  <Ionicons name="image-outline" size={24} color="#5f6368" />
                </View>
              )}
              <View style={styles.textContainer}>
                <Text style={styles.articleTitle} numberOfLines={2}>{stripHtml(item.displaytitle) || item.title}</Text>
                <Text style={styles.articleDescription} numberOfLines={2}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        /* Empty State */
        <View style={styles.content}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="bookmark-outline" size={64} color="#5f6368" />
          </View>
          <Text style={styles.emptyTitle}>No saved pages yet</Text>
          <Text style={styles.emptySubtitle}>
            Add articles to a list for reading later, even when you're offline.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -40
  },
  listContent: {
    padding: 16
  },
  articleItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#202124',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    alignItems: 'center'
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  placeholderThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#303134',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flex: 1
  },
  articleTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  articleDescription: {
    color: '#9aa0a6',
    fontSize: 14
  },
  emptyIconContainer: {
    marginBottom: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#202124',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9aa0a6',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
