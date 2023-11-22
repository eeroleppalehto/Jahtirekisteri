import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

// Screen for displaying an error message
function ErrorScreen() {
    const theme = useTheme();
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
            }}
        >
            <MaterialIcons
                name="error-outline"
                size={28}
                color={theme.colors.error}
            />
            <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                Virhe ladattaessa sivua
            </Text>
        </View>
    );
}

export default ErrorScreen;
