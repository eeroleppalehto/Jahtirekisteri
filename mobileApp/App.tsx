import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/components/Main';

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <Main />
            </PaperProvider>
        </SafeAreaProvider>
    );
}
