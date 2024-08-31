import { useState } from "react";
import { View } from "react-native";
import { Text, useTheme, Button, Surface } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { ServerError } from "../utils/ServerError";

type Props = {
    error: Error;
    reload?: () => void;
};

// Screen for displaying an error message
export function ErrorScreen({ error, reload }: Props) {
    const [isHidden, setIsHidden] = useState(true);
    const theme = useTheme();

    const isServerError = error instanceof ServerError;

    const isDetails = isServerError && error.errorDetails.length > 0;

    const ErrorDetails = ({ error }: { error: ServerError }) => {
        const DetailsList = () => {
            return (
                <>
                    {error.errorDetails.map((detail, index) => (
                        <Text key={index} variant="bodySmall">
                            {detail}
                        </Text>
                    ))}
                </>
            );
        };

        if (error.errorDetails.length === 0) return null;

        return <DetailsList />;
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                paddingTop: "40%",
                // justifyContent: "center",
                gap: 10,
            }}
        >
            <Surface
                elevation={3}
                style={{
                    paddingTop: 50,
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    width: "80%",
                    // marginHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    backgroundColor: theme.colors.errorContainer,
                }}
            >
                <MaterialIcons
                    name="error-outline"
                    size={28}
                    color={theme.colors.error}
                />
                <Text
                    variant="bodyLarge"
                    style={{
                        color: theme.colors.onErrorContainer,
                        marginBottom: 40,
                    }}
                >
                    Virhe ladattaessa sivua!
                </Text>
                {isServerError ? (
                    <Text
                        variant="bodyMedium"
                        style={{
                            color: theme.colors.onErrorContainer,
                            fontWeight: "bold",
                        }}
                    >
                        {error.errorType}:
                    </Text>
                ) : null}
                <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onErrorContainer }}
                >
                    {error.message}
                </Text>
                {/* Buttons */}
                <View style={{ flexDirection: "row", marginTop: 40 }}>
                    {isDetails ? (
                        <Button
                            mode="contained"
                            buttonColor={theme.colors.surface}
                            textColor={theme.colors.onErrorContainer}
                            style={{ flex: 1 }}
                            onPress={() => {
                                setIsHidden(!isHidden);
                            }}
                        >
                            Lisätiedot
                        </Button>
                    ) : null}
                    {reload ? (
                        <Button
                            mode="contained"
                            buttonColor={theme.colors.onErrorContainer}
                            style={{ flex: 1 }}
                            onPress={() => {
                                reload();
                            }}
                        >
                            Yritä Uudelleen
                        </Button>
                    ) : null}
                </View>

                {!isHidden && isServerError ? (
                    <View
                        style={{
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            padding: 12,
                            marginTop: 20,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: theme.colors.onErrorContainer,
                        }}
                    >
                        <ErrorDetails error={error} />
                    </View>
                ) : null}
            </Surface>
        </View>
    );
}
