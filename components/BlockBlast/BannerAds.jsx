import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

let BannerAd, BannerAdSize, TestIds;
const isWeb = Platform.OS === 'web';
const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

if (!isWeb && !isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
  } catch(e) { console.log(e) }
}

const BannerAds = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    if (isWeb || isExpoGo) {
        return (
            <View style={styles.bannerContainer}>
                <Text style={styles.loadingText}>
                  {isWeb ? '[Quảng cáo ẩn trên Web]' : '[Quảng cáo ẩn trên Expo Go]'}
                </Text>
            </View>
        );
    }

    const bannerAdUnitId = __DEV__
        ? TestIds.BANNER
        : Platform.select({
            android: 'ca-app-pub-1666762810401308/4871477553',
            default: TestIds.BANNER,
        });

    return (
        <View style={styles.bannerContainer}>
            {errorMessage && (
                <Text style={styles.errorText}>
                    Quảng cáo lỗi: {errorMessage}
                </Text>
            )}
            <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}

                onAdLoaded={() => {
                    console.log('Banner quảng cáo đã tải thành công');
                    setIsLoaded(true);
                    setErrorMessage(null);
                }}
                onAdFailedToLoad={(error) => {
                    console.error('Banner quảng cáo tải thất bại:', error);
                    setErrorMessage(error.message || 'Không tải được quảng cáo');
                    setIsLoaded(false);
                }}
                onAdOpened={() => console.log('Người dùng mở quảng cáo')}
                onAdClosed={() => console.log('Quảng cáo đã đóng')}
                onAdImpressionRecorded={() => console.log('Quảng cáo đã ghi nhận impression')}
            />
            {!isLoaded && !errorMessage && (
                <Text style={styles.loadingText}>Đang tải quảng cáo...</Text>
            )}
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
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginVertical: 8,
        textAlign: 'center',
    },
});

export default BannerAds;