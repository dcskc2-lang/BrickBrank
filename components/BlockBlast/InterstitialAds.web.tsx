import { useEffect } from 'react';
import { Platform } from 'react-native';

export const loadInterstitial = () => {
    console.log('Web Mode: Đã tải quảng cáo Interstitial (Fake)');
};

export const showInterstitial = async () => {
    if (Platform.OS !== 'web') return false;

    console.log('Web Mode: Đang hiển thị quảng cáo Interstitial (Fake)...');

    return new Promise((resolve) => {
        // Tạo một giao diện giả lập full-screen che toàn màn hình bằng js thuần
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.fontFamily = 'sans-serif';

        const title = document.createElement('h1');
        title.innerText = 'ADS';
        title.style.color = '#f1c40f';
        title.style.marginBottom = '20px';

        const desc = document.createElement('p');
        desc.innerText = 'Quảng cáo giả lập để test luồng trên Web.';
        desc.style.marginBottom = '40px';
        desc.style.fontSize = '16px';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X Đóng Quảng Cáo';
        closeBtn.style.padding = '15px 30px';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.backgroundColor = '#e74c3c';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.cursor = 'pointer';

        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };

        overlay.appendChild(title);
        overlay.appendChild(desc);
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
    });
};

export const useInterstitialAds = () => {
    useEffect(() => {
        loadInterstitial();
    }, []);
};

const InterstitialAds = () => {
    useInterstitialAds();
    return null;
};

export default InterstitialAds;