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
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    const { onLogin } = useAuth();

    const onSubmit = async () => {
        setIsLoading(true);

        if (!onLogin) {
            setIsLoading(false);
            setErrorMessage("Kirjautuminen ei onnistunut");
            return;
        }

        const result = await onLogin({ username, password });
        if (result !== "OK") {
            setErrorMessage(result);
        }
        setIsLoading(false);
    };

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    label="Käyttäjätunnus"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                />
                <View>
                    <TextInput
                        label="Salasana"
                        autoCapitalize="none"
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
                    {/* <Text
                        variant="bodyMedium"
                        style={{ textDecorationLine: "underline" }}
                    >
                        Unohditko salasanasi?
                    </Text> */}
                    {errorMessage && (
                        <Text
                            variant="bodyMedium"
                            style={{ color: theme.colors.error }}
                        >
                            {errorMessage}
                        </Text>
                    )}
                </View>
                <Text variant="bodyMedium">
                    Jos sinulla ei ole tunnuksia, ota yhteyttä ylläpitoon
                </Text>
                <Button
                    mode="contained"
                    onPress={onSubmit}
                    loading={isLoading}
                    contentStyle={{ flexDirection: "row-reverse" }}
                    icon={() => (
                        <MaterialIcons
                            name="login"
                            size={24}
                            color={theme.colors.onPrimary}
                        />
                    )}
                >
                    KIRJAUDU
                </Button>
            </View>
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
