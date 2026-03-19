import { StyleSheet, Text, View } from 'react-native';
import BannerAds from '../components/BlockBlast/BannerAds';
import PlayButton from '../components/PlayButton';

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BRICK BRANK</Text>

      <View style={styles.centerContainer}>
        <PlayButton onPress={() => navigation.navigate('GamePlay')} />
      </View>

      <BannerAds />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 80,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60, // Leave space for the banner ad
  },
});