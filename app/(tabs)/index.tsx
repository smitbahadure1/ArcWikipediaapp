import { Image } from 'expo-image';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  MOCK_NEWS_VARIANTS,
  MOCK_TFA_VARIANTS,
  MOCK_TOP_READ_VARIANTS,
  MOCK_POTD_VARIANTS,
  MOCK_ON_THIS_DAY_VARIANTS
} from '@/constants/mocks';

// Helper to get today's date in YYYY/MM/DD format
const getTodayDatePath = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// Helper to get a random date from the past (last 30 days) for variety
const getRandomPastDatePath = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30) - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// Helper to strip HTML tags from a string
const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [random, setRandom] = useState<any>(null);

  const fetchData = async () => {
    try {
      setErrorMsg(null);
      let datePath = getTodayDatePath();
      let url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${datePath}`;

      // ... headers logic ...
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
        if (!response.ok) throw new Error('API request failed');
      } catch (e) {
        console.log("Primary fetch failed", e);
        if (Platform.OS === 'web') {
          try {
            console.log("Trying CORS proxy...");
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            response = await fetch(proxyUrl);
          } catch (proxyError) {
            console.log("Proxy fetch failed", proxyError);
          }
        }
      }

      // Randomly select variants to simulate "new news"
      const randomNews = MOCK_NEWS_VARIANTS[Math.floor(Math.random() * MOCK_NEWS_VARIANTS.length)];
      const randomTfa = MOCK_TFA_VARIANTS[Math.floor(Math.random() * MOCK_TFA_VARIANTS.length)];

      if (!response || !response.ok) {
        console.log("Using fallback data due to fetch error.");

        // FALLBACK DATA
        const fallbackData = {
          tfa: randomTfa,
          mostread: {
            articles: [
              { title: "React_Native", displaytitle: "React Native", views: "12,403", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png" } },
              { title: "TypeScript", displaytitle: "TypeScript", views: "8,920", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/200px-Typescript_logo_2020.svg.png" } },
              { title: "Expo_(framework)", displaytitle: "Expo (framework)", views: "5,100", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Expo_Combinations_Logomark.svg/200px-Expo_Combinations_Logomark.svg.png" } },
            ]
          },
          image: {
            title: "Picture of the day",
            thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/640px-Altja_j%C3%B5gi_Lahemaal.jpg" },
            description: { text: "A beautiful river landscape in Lahemaa National Park, Estonia." }
          },
          news: randomNews,
          onthisday: [
            { year: 2023, text: "Wikipedia continues to be a free encyclopedia that anyone can edit.", pages: [{ title: "Wikipedia", displaytitle: "Wikipedia", thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Wikipedia-logo.png/200px-Wikipedia-logo.png" } }] }
          ]
        };
        setData(fallbackData);
        setRandom({
          title: "Soccer_ball",
          displaytitle: "Random Fallback",
          extract: "This is a random article placeholder shown when the API is unreachable.",
          thumbnail: { source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Soccer_ball.svg/200px-Soccer_ball.svg.png" }
        });
      } else {
        const json = await response.json();

        // 2. Fetch Random Past Data for Variety (TFA, POTD)
        // We fetch a random past date to get a different Featured Article and Picture of the Day on refreshing,
        // while keeping News and On This Day current.
        try {
          const randomPath = getRandomPastDatePath();
          const randomUrl = `https://en.wikipedia.org/api/rest_v1/feed/featured/${randomPath}`;

          let randResp = await fetch(randomUrl, { headers });
          if (!randResp.ok && Platform.OS === 'web') {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(randomUrl)}`;
            randResp = await fetch(proxyUrl);
          }

          if (randResp.ok) {
            const randJson = await randResp.json();
            if (randJson.tfa) json.tfa = randJson.tfa;
            if (randJson.image) json.image = randJson.image;
          }
        } catch (e) {
          console.log("Failed to fetch random variety", e);
        }

        // Shuffle mult-item lists to make 'refresh' feel dynamic while using real data
        if (json.news && Array.isArray(json.news)) {
          json.news = json.news.sort(() => 0.5 - Math.random());
        }
        if (json.onthisday && Array.isArray(json.onthisday)) {
          json.onthisday = json.onthisday.sort(() => 0.5 - Math.random());
        }
        if (json.mostread && json.mostread.articles && Array.isArray(json.mostread.articles)) {
          json.mostread.articles = json.mostread.articles.sort(() => 0.5 - Math.random());
        }

        setData(json);

        // Random Article Fetch
        try {
          let randomUrl = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
          let randomResp = await fetch(randomUrl, { headers });
          const randomJson = await randomResp.json();
          setRandom(randomJson);
        } catch (e) {
          setRandom({ displaytitle: "Loading Error", extract: "Could not fetch random article." });
        }
      }

    } catch (error: any) {
      console.error('Error fetching Wikipedia feed:', error);
      setErrorMsg(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial call

    // Refresh every 10 minutes (600,000 ms)
    const interval = setInterval(fetchData, 600000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>{errorMsg}</Text>
        <TouchableOpacity onPress={() => { setLoading(true); fetchData(); }}
          style={{ padding: 10, backgroundColor: '#202124', borderRadius: 8 }}>
          <Text style={{ color: '#8ab4f8' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { tfa, mostread, image, onthisday, news } = data || {};

  const handlePress = (path: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8ab4f8" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.searchBar} onPress={() => handlePress('/search')}>
            <Ionicons name="search" size={20} color="#9aa0a6" style={styles.searchIcon} />
            <Text style={styles.searchText}>Search Arc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            {/* Assuming a user avatar or generic icon */}
            <View style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* Featured Article */}
        {tfa && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured article</Text>
            <TouchableOpacity style={styles.card} onPress={() => handlePress({ pathname: '/article', params: { title: tfa.title || tfa.displaytitle } })}>
              {tfa.thumbnail && (
                <Image
                  source={{ uri: tfa.thumbnail.source }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{stripHtml(tfa.displaytitle)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Top Read */}
        {mostread && mostread.articles && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top read</Text>
            {mostread.articles.slice(0, 5).map((article: any, index: number) => (
              <TouchableOpacity key={index} style={styles.topReadItem} onPress={() => handlePress({ pathname: '/article', params: { title: article.title || article.displaytitle } })}>
                <View style={styles.topReadRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.topReadContent}>
                  <Text style={styles.topReadTitle} numberOfLines={1}>{stripHtml(article.displaytitle)}</Text>
                  <Text style={styles.topReadViews}>{Number(article.views).toLocaleString()} views</Text>
                </View>
                {article.thumbnail && (
                  <Image source={{ uri: article.thumbnail.source }} style={styles.topReadImage} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.moreLink}>
              <Text style={styles.moreLinkText}>More top read</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Picture of the Day */}
        {image && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Picture of the day</Text>
            <View style={styles.imageCard}>
              <Image
                source={{ uri: image.thumbnail.source }} // Using thumbnail for faster load, usually sufficient size
                style={styles.potdImage}
                contentFit="cover"
              />
              <View style={styles.potdOverlay}>
                {/* Icon controls matching screenshot if needed */}
              </View>
              <View style={styles.potdContent}>
                <Text style={styles.cardDescription}>{stripHtml(image.description ? image.description.text : (image.title || 'Picture of the day'))}</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#8ab4f8" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* In the news */}
        {news && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In the news</Text>
            {news.slice(0, 2).map((item: any, index: number) => (
              <View key={index} style={styles.newsItem}>
                {item.thumbnail && (
                  <Image source={{ uri: item.thumbnail.source }} style={styles.newsImage} />
                )}
                <Text style={styles.newsText}>{stripHtml(item.story)}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.moreLink}>
              <Text style={styles.moreLinkText}>More news</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* On this day */}
        {onthisday && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>On this day</Text>
            {onthisday.slice(0, 1).map((item: any, index: number) => (
              <View key={index} style={styles.onThisDayItem}>
                <View style={styles.onThisDayYearContainer}>
                  <Text style={styles.onThisDayYear}>{item.year}</Text>
                </View>
                <Text style={styles.onThisDayText}>{stripHtml(item.text)}</Text>
              </View>
            ))}
            {/*  Show pages related to this event */}
            {onthisday[0]?.pages && onthisday[0].pages[0]?.thumbnail && (
              <TouchableOpacity style={styles.card} onPress={() => handlePress({ pathname: '/article', params: { title: onthisday[0].pages[0].title || onthisday[0].pages[0].displaytitle } })}>
                <Image source={{ uri: onthisday[0].pages[0].thumbnail.source }} style={[styles.featuredImage, { height: 150 }]} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{stripHtml(onthisday[0].pages[0].displaytitle)}</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.moreLink}>
              <Text style={styles.moreLinkText}>More on this day</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Random article */}
        {random && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Random article</Text>
            <TouchableOpacity style={styles.card} onPress={() => handlePress({ pathname: '/article', params: { title: random.title || random.displaytitle } })}>
              {random.thumbnail && (
                <Image
                  source={{ uri: random.thumbnail.source }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{stripHtml(random.displaytitle)}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreLink}>
              <Text style={styles.moreLinkText}>Another random article</Text>
            </TouchableOpacity>
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202124',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#9aa0a6',
    fontSize: 16,
  },
  avatarButton: {
    padding: 4
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5f6368',
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#202124',
    paddingBottom: 16,
  },
  sectionTitle: {
    color: '#8ab4f8', // Wikipedia blue/link color
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    textTransform: 'uppercase', // Wikipedia app often does this or not, screenshot seems simple text
  },
  card: {
    backgroundColor: '#202124',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold', // "Serif" font often used in Wiki
    marginBottom: 8,
    fontFamily: 'serif',
  },
  cardDescription: {
    color: '#bdc1c6',
    fontSize: 14,
    lineHeight: 20,
  },
  topReadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topReadRank: {
    width: 24,
    marginRight: 12,
  },
  rankText: {
    color: '#8ab4f8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topReadContent: {
    flex: 1,
    marginRight: 12,
  },
  topReadTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  topReadViews: {
    color: '#9aa0a6',
    fontSize: 12,
  },
  topReadImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  imageCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#202124',
    overflow: 'hidden'
  },
  potdImage: {
    width: '100%',
    height: 250,
  },
  potdOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row'
  },
  potdContent: {
    padding: 16
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#303134'
  },
  actionButtonText: {
    color: '#8ab4f8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8
  },
  newsItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  newsText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22
  },
  onThisDayItem: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row'
  },
  onThisDayYearContainer: {
    marginRight: 12,
  },
  onThisDayYear: {
    color: '#8ab4f8',
    fontWeight: 'bold',
    fontSize: 14
  },
  onThisDayText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22
  },
  moreLink: {
    paddingHorizontal: 16,
    marginTop: 8
  },
  moreLinkText: {
    color: '#8ab4f8',
    fontSize: 14,
    fontWeight: '600'
  }
});
