import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Main from './src/components/Main';

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <NavigationContainer>
                    <Main />
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
