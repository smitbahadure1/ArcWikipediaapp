import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ActivityScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Activity</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Graphic Placeholder */}
                <View style={styles.graphicContainer}>
                    {/* Document Icon approximation */}
                    <MaterialCommunityIcons name="file-document" size={120} color="#e8eaed" />
                    {/* User Circle Badge */}
                    <View style={styles.badgeContainer}>
                        <Ionicons name="person-circle" size={64} color="#669df6" />
                    </View>
                </View>

                <Text style={styles.description}>
                    Log in or create an account to view your activity on the Arc app
                </Text>

                {/* Create Account Button */}
                <TouchableOpacity style={styles.createButton}>
                    <Ionicons name="person" size={18} color="#ffffff" style={styles.btnIcon} />
                    <Text style={styles.createButtonText}>Create account</Text>
                </TouchableOpacity>

                {/* Log In Button */}
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
            </View>
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
    headerTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: -60, // visual adjustment to align center vertically better with header
    },
    graphicContainer: {
        position: 'relative',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: '#000000', // Match background for badge outline effect if needed
        borderRadius: 32,
    },
    description: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontWeight: '500',
    },
    createButton: {
        backgroundColor: '#669df6', // Wikipedia blue-ish
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginBottom: 24,
        minWidth: 200,
        justifyContent: 'center',
    },
    btnIcon: {
        marginRight: 8,
    },
    createButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
