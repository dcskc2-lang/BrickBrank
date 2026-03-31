import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';

let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;
let mobileAds: any = null;

const isWeb = Platform.OS === 'web';
const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

if (!isWeb && !isExpoGo) {
    try {
        const ads = require('react-native-google-mobile-ads');
        InterstitialAd = ads.InterstitialAd;
        AdEventType = ads.AdEventType;
        TestIds = ads.TestIds;
        mobileAds = ads.default;
    } catch (e) {
        console.log('Không load được Google Mobile Ads:', e);
    }
}

let currentInterstitial: any = null;
let isAdLoaded = false;
let unsubLoaded: () => void;
let unsubError: () => void;
let unsubClosed: () => void;

export const loadInterstitial = async () => {
    if (!InterstitialAd || isWeb || isExpoGo) return;

    try {
        if (mobileAds) {
            await mobileAds().initialize();
        }
    } catch (e) {
        console.log('Lỗi khởi tạo Admob SDK:', e);
    }

    const adUnitId = __DEV__
        ? TestIds.INTERSTITIAL
        : 'ca-app-pub-1666762810401308/3063624792';

    if (unsubLoaded) unsubLoaded();
    if (unsubError) unsubError();
    if (unsubClosed) unsubClosed();

    currentInterstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    unsubLoaded = currentInterstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial Ads đã sẵn sàng');
        isAdLoaded = true;
    });

    unsubError = currentInterstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        console.error('Interstitial load lỗi:', error);
        isAdLoaded = false;
    });

    unsubClosed = currentInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial đã đóng');
        isAdLoaded = false;
        setTimeout(loadInterstitial, 1200);
    });

    currentInterstitial.load();
};

export const showInterstitial = async (adsRemoved = false): Promise<boolean> => {
    if (adsRemoved) return false;

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
            if (unsubLoaded) unsubLoaded();
            if (unsubError) unsubError();
            if (unsubClosed) unsubClosed();
        };
    }, []);
};

const InterstitialAds = () => {
    useInterstitialAds();
    return null;
};

export default InterstitialAds;