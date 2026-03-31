import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { AudioContext } from '../../app/(tabs)/index';

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
    const { adsRemoved } = useContext(AudioContext);

    if (adsRemoved) return null;

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
        <View style={[styles.bannerContainer, !isLoaded && { height: 0, opacity: 0 }]}>
            <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}

                onAdLoaded={() => {
                    console.log('Banner quảng cáo đã tải thành công');
                    setIsLoaded(true);
                }}
                onAdFailedToLoad={(error) => {
                    console.error('Banner quảng cáo tải thất bại:', error);
                    setIsLoaded(false);
                }}
                onAdOpened={() => console.log('Người dùng mở quảng cáo')}
                onAdClosed={() => console.log('Quảng cáo đã đóng')}
                onAdImpressionRecorded={() => console.log('Quảng cáo đã ghi nhận impression')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#000',
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