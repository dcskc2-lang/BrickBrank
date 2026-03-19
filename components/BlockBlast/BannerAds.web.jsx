import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BannerAds = () => {
    return (
        <View style={styles.bannerContainer}>
            <Text style={styles.loadingText}>[Quảng cáo ẩn trên Web để tránh lỗi]</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
    },
    loadingText: {
        color: '#888',
        fontSize: 12,
        marginVertical: 8,
    }
});

export default BannerAds;
