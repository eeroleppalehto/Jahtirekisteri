import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

// Screen for displaying an error message
function ErrorScreen() {
    const theme = useTheme();
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text style={{ color: theme.colors.error }}>
                Virhe ladattaessa sivua!
            </Text>
        </View>
    );
}

export default ErrorScreen;
