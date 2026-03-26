import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';

let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

const isWeb = Platform.OS === 'web';
const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

if (!isWeb && !isExpoGo) {
    try {
        const ads = require('react-native-google-mobile-ads');
        InterstitialAd = ads.InterstitialAd;
        AdEventType = ads.AdEventType;
        TestIds = ads.TestIds;
    } catch (e) {
        console.log('Không load được Google Mobile Ads:', e);
    }
}

let currentInterstitial: any = null;
let isAdLoaded = false;
export const loadInterstitial = () => {
    if (!InterstitialAd || isWeb || isExpoGo) return;

    const adUnitId = __DEV__
        ? TestIds.INTERSTITIAL
        : 'ca-app-pub-1666762810401308/3063624792';
    if (currentInterstitial) {
        currentInterstitial.removeAllListeners?.();
    }

    currentInterstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    currentInterstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial Ads đã sẵn sàng');
        isAdLoaded = true;
    });

    currentInterstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        console.error('Interstitial load lỗi:', error);
        isAdLoaded = false;
    });

    currentInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial đã đóng');
        isAdLoaded = false;
        setTimeout(loadInterstitial, 1200);
    });

    currentInterstitial.load();
};

export const showInterstitial = async (): Promise<boolean> => {
    if (!currentInterstitial || !isAdLoaded) {
        console.log('Interstitial chưa load xong');
        return false;
    }

    try {
        await currentInterstitial.show();
        return true;
    } catch (error) {
        console.error('Không thể hiển thị Interstitial:', error);
        isAdLoaded = false;
        return false;
    }
};

export const useInterstitialAds = () => {
    useEffect(() => {
        loadInterstitial();

        return () => {
            if (currentInterstitial) {
                currentInterstitial.removeAllListeners?.();
            }
        };
    }, []);
};

const InterstitialAds = () => {
    useInterstitialAds();
    return null;
};

export default InterstitialAds;