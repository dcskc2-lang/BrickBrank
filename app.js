import { StyleSheet, Text, View } from 'react-native';
import app from './firebaseconfig'; // Import file bạn vừa tạo

const App = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Firebase Web đã kết nối với App ID: {app.options.appId}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default App;