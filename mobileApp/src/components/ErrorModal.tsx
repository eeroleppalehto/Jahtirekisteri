import { View } from "react-native";
import { Button, Text, useTheme, Modal } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
    isError: boolean;
    onDismiss: () => void;
    message?: string;
};

export function ErrorModal({ isError, onDismiss, message }: Props) {
    const theme = useTheme();
    return (
        <Modal
            visible={isError}
            style={{
                alignItems: "center",
                width: "100%",
            }}
            onDismiss={onDismiss}
        >
            <View
                style={{
                    backgroundColor: theme.colors.errorContainer,
                    padding: 20,
                    paddingHorizontal: 40,
                    borderRadius: 16,
                    alignItems: "center",
                    gap: 20,
                }}
            >
                <MaterialIcons
                    name="error-outline"
                    size={28}
                    color={theme.colors.error}
                />
                {message ? (
                    <Text
                        variant="bodyLarge"
                        style={{
                            color: theme.colors.onErrorContainer,
                        }}
                    >
                        {message}
                    </Text>
                ) : (
                    <View style={{ alignItems: "center" }}>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.onErrorContainer,
                            }}
                        >
                            {`Virhe tallentaessa.`}
                        </Text>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.onErrorContainer,
                            }}
                        >
                            {`Yritä uudelleen.`}
                        </Text>
                    </View>
                )}
                <Button
                    mode="contained"
                    buttonColor={theme.colors.onErrorContainer}
                    onPress={onDismiss}
                >
                    Sulje ikkuna
                </Button>
            </View>
        </Modal>
    );
}
