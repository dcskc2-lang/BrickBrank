import { useEffect } from 'react';

export const loadInterstitial = () => {
};

export const showInterstitial = async (): Promise<boolean> => {
    console.log('Quảng cáo không được hỗ trợ trên Web, bỏ qua việc hiển thị.');
    return false;
};

export const useInterstitialAds = () => {
    useEffect(() => {
    }, []);
};

const InterstitialAds = () => {
    useInterstitialAds();
    return null;
};

export default InterstitialAds;
