import { View } from "react-native";
import { Text, MD3Colors, useTheme } from "react-native-paper";

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
