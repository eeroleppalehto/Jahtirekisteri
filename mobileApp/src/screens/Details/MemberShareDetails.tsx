import { ScrollView } from "react-native-gesture-handler";
import {
    Text,
    useTheme,
    Divider,
    Avatar,
    ActivityIndicator,
    Button,
} from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { ErrorScreen } from "../ErrorScreen";
import { ShareViewQuery } from "../../types";
import { View, StyleSheet } from "react-native";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { useRef } from "react";
import { ShareShotDetails } from "./utils/ShareShotDetails";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

type Props = RootStackScreenProps<"Details">;

type MemberShareViewQuery = {
    tapahtuma_jasen_id: number;
    paiva: string;
    jasenyys_id: number;
    kokonimi: string;
    osnimitys: "Koko" | "Puolikas" | "Neljännes";
    kaadon_kasittely_id: number;
    maara: number;
    kaato_id: number;
    seurue_id: number;
};

export function MemberShareDetails({ route, navigation }: Props) {
    if (!route.params?.data)
        return (
            <ErrorScreen error={new Error("Tapahtui virhe navigaatiossa")} />
        );

    const bottomSheetRef = useRef<BottomSheet>(null);

    const { data } = route.params as { data: ShareViewQuery };

    const result = useFetchQuery<MemberShareViewQuery[]>(
        `views/?name=jasenjaot_nimilla&column=kaato_id&value=${data.kaato_id}`,
        ["MemberShare", data.kaato_id]
    );

    const theme = useTheme();

    const dateStringFin = (dateString: string) => {
        // Format date to Finnish format
        const dateStringArray = new Date(dateString)
            .toLocaleDateString("fi-FI", {
                year: "2-digit",
                month: "short",
                day: "numeric",
            })
            .split(" ");

        return dateStringArray.toString().replace(/,/g, "");
    };

    const Shares = (share: MemberShareViewQuery) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                }}
            >
                <Text style={{ flex: 3 }}>{share.kokonimi}</Text>

                <Text style={{ flex: 2 }}>{share.osnimitys}</Text>

                <Text style={{ flex: 2, textAlign: "right" }}>
                    {dateStringFin(share.paiva)}
                </Text>
            </View>
        );
    };

    return (
        <>
            <ScrollView>
                <View style={{ alignItems: "center", paddingTop: 30, gap: 24 }}>
                    <Text variant="headlineMedium">Jaettu</Text>
                    <Avatar.Text
                        size={128}
                        labelStyle={{ fontSize: 32 }}
                        label={
                            data.jaettu_pros
                                ? `${data.jaettu_pros.toString()}%`
                                : "0%"
                        }
                    />
                </View>
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 24,
                        paddingTop: 20,
                    }}
                >
                    Jaot
                </Text>
                <View
                    style={{
                        ...styles.sharesList,
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.surfaceVariant,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 12,
                            paddingTop: 12,
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                flex: 3,
                                fontWeight: "bold",
                                color: theme.colors.primary,
                            }}
                        >
                            Jäsen
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                flex: 2,
                                fontWeight: "bold",
                                color: theme.colors.primary,
                            }}
                        >
                            Osnimity
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                flex: 2,
                                fontWeight: "bold",
                                color: theme.colors.primary,
                                textAlign: "right",
                            }}
                        >
                            Päivämäärä
                        </Text>
                    </View>
                    <Divider />
                    {result.isLoading ? <ActivityIndicator /> : null}
                    {result.isError ? (
                        <ErrorScreen error={result.error} />
                    ) : null}
                    {result.isSuccess ? (
                        <>
                            {result.data.length === 0 ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: 16,
                                        marginVertical: 8,
                                        gap: 5,
                                    }}
                                >
                                    <MaterialIcons
                                        name="not-interested"
                                        size={16}
                                        color={theme.colors.outline}
                                    />
                                    <Text
                                        variant="bodyLarge"
                                        style={{
                                            color: theme.colors.outline,
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Ei jakoja
                                    </Text>
                                </View>
                            ) : (
                                result.data.map((share) => (
                                    <Shares
                                        key={share.tapahtuma_jasen_id}
                                        {...share}
                                    />
                                ))
                            )}
                        </>
                    ) : null}
                </View>
                <View
                    style={{
                        ...styles.buttonContainer,
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.surfaceVariant,
                    }}
                >
                    <Button
                        mode="contained-tonal"
                        onPress={() => bottomSheetRef.current?.snapToIndex(2)}
                        style={styles.button}
                        icon="view-list"
                    >
                        Kaadon tiedot
                    </Button>
                    <Button
                        mode="elevated"
                        disabled={false}
                        icon={"share"}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate("Forms", { type: "jäsen" })
                        }
                    >
                        {"Uusi jako"}
                    </Button>
                </View>
            </ScrollView>
            <BottomSheetPicker ref={bottomSheetRef}>
                <BottomSheetScrollView>
                    <ShareShotDetails data={data} theme={theme} />
                    <View style={{ paddingVertical: 150 }}></View>
                </BottomSheetScrollView>
            </BottomSheetPicker>
        </>
    );
}

const styles = StyleSheet.create({
    sharesList: {
        marginHorizontal: 24,
        marginVertical: 12,
        gap: 8,
        borderWidth: 1,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        margin: 24,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    button: {
        flex: 1,
        padding: 6,
        borderRadius: 12,
    },
});
