import { View, StyleSheet } from "react-native";
import {
    useTheme,
    TextInput,
    Surface,
    Button,
    Text,
    Snackbar,
} from "react-native-paper";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthProvider";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [securePassword, setSecurePassword] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const theme = useTheme();

    const { onLogin } = useAuth();

    const onSubmit = async () => {
        if (onLogin) {
            const result = await onLogin({ username, password });
            console.log(result);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    label="Käyttäjätunnus"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                />
                <View>
                    <TextInput
                        label="Salasana"
                        value={password}
                        secureTextEntry={securePassword}
                        onChangeText={setPassword}
                        mode="outlined"
                        right={
                            <TextInput.Icon
                                icon={securePassword ? "eye" : "eye-off"}
                                onPress={() =>
                                    setSecurePassword(!securePassword)
                                }
                            />
                        }
                    />
                    <Text
                        variant="bodyMedium"
                        style={{ textDecorationLine: "underline" }}
                    >
                        Unohditko salasanasi?
                    </Text>
                </View>
                <Text variant="bodyMedium">
                    Jos sinulla ei ole tunnuksia, ota yhteyttä ylläpitoon
                </Text>
                <Button
                    mode="contained"
                    onPress={onSubmit}
                    contentStyle={{ flexDirection: "row-reverse" }}
                    icon={() => (
                        <MaterialIcons
                            name="navigate-next"
                            size={24}
                            color={theme.colors.onPrimary}
                        />
                    )}
                >
                    KIRJAUDU
                </Button>
            </View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => {}}
                action={{
                    label: "OK",
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
        gap: 30,
    },
    surface: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 8,
        gap: 30,
    },
});