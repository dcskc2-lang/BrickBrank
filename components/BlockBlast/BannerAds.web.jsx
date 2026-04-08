import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BannerAds = () => {
    const handlePress = () => {
        Linking.openURL('https://google.com').catch((err) =>
            console.error("Lỗi khi mở link:", err)
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={styles.container}
        >
            <View style={styles.adBox}>
                <View style={styles.adBadge}>
                    <Text style={styles.adBadgeText}>Ad</Text>
                </View>
                <Text style={styles.adContentText}>ĐẠI LÝ QUẢNG CÁO</Text>
                <Text style={styles.adSubText}>Nhấn để truy cập</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: '5%',
        backgroundColor: '#f8f9fa',
    },
    adBox: {
        width: '100%',
        height: '100%',
        maxWidth: 728,
        backgroundColor: '#e6f2ff',
        borderWidth: 1,
        borderColor: '#0066cc',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    adBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#f1c40f',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderBottomRightRadius: 4,
    },
    adBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    adContentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    adSubText: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    }
});

export default BannerAds;
