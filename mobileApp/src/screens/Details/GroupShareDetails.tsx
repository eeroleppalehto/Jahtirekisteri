import { ScrollView } from "react-native-gesture-handler";
import {
    Text,
    useTheme,
    Avatar,
    ActivityIndicator,
    Button,
    Chip,
} from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { ErrorScreen } from "../ErrorScreen";
import { ShareViewQuery } from "../../types";
import { View, StyleSheet } from "react-native";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { useRef, useState } from "react";
import { ShareShotDetails } from "./utils/ShareShotDetails";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuth } from "../../context/AuthProvider";
import { WRITE_RIGHTS_SET } from "../../utils/authenticationUtils";

type Props = RootStackScreenProps<"Details">;

type GroupShareViewQuery = {
    tapahtuma_id: number;
    paiva: string;
    ryhma_id: number;
    ryhman_nimi: string;
    osnimitys: "Koko" | "Puolikas" | "Neljännes";
    kaadon_kasittely_id: number;
    maara: number;
    kaato_id: number;
    seurue_id: number;
    kasittely_maara: number;
};

export function GroupShareDetails({ route, navigation }: Props) {
    const [error, setError] = useState<Error | null>(null);
    if (!route.params?.data)
        return (
            <ErrorScreen error={new Error("Tapahtui virhe navigaatiossa")} />
        );

    const bottomSheetRef = useRef<BottomSheet>(null);

    const { authState } = useAuth();

    const hasWriteRights = !WRITE_RIGHTS_SET.has(authState?.role || "");

    const { data } = route.params as { data: ShareViewQuery };

    const result = useFetchQuery<GroupShareViewQuery[]>(
        `views/?name=ryhmajaot_nimilla&column=kaato_id&value=${data.kaato_id}`,
        ["GroupShare", data.kaato_id]
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

    const Shares = ({
        share,
        isLast,
    }: {
        share: GroupShareViewQuery;
        isLast: boolean;
    }) => {
        const containerStyle = isLast
            ? {
                  ...styles.shareContainer,
                  ...styles.shareContainerLast,
              }
            : {
                  ...styles.shareContainer,
              };

        return (
            <View
                style={{
                    ...containerStyle,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.surfaceVariant,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text variant="labelLarge" style={{}}>
                        {share.ryhman_nimi}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        variant="labelLarge"
                        style={{
                            textAlign: "left",
                            color: theme.colors.outline,
                        }}
                    >
                        {`Ruhonosa: ${share.osnimitys}`}
                    </Text>
                    <Text
                        variant="labelLarge"
                        style={{ color: theme.colors.outline }}
                    >
                        {dateStringFin(share.paiva)}
                    </Text>
                </View>
            </View>
        );
    };

    const ShareList = ({ shares }: { shares: GroupShareViewQuery[] }) => {
        const last = shares.length - 1;

        return (
            <View style={{ gap: 4 }}>
                {shares.map((share, index) => (
                    <Shares
                        key={share.tapahtuma_id}
                        share={share}
                        isLast={last === index}
                    />
                ))}
            </View>
        );
    };

    const openBottomSheet = () => {
        try {
            bottomSheetRef.current?.snapToIndex(2);
        } catch (error) {
            if (error instanceof Error) setError(error);
        }
    };

    const navigateToForm = () => {
        try {
            navigation.navigate("Forms", {
                type: "GroupShare",
                clear: false,
                data: {
                    paiva: undefined,
                    kaadon_kasittely_id: data.kaadon_kasittely_id,
                    osnimitys: undefined,
                    maara: data.ruhopaino,
                    ryhma_id: undefined,
                },
            });
        } catch (error) {
            if (error instanceof Error) setError(error);
        }
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
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginHorizontal: 24,
                        marginTop: 32,
                        padding: 12,
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.surfaceVariant,
                        borderWidth: 1,
                        borderRadius: 24,
                    }}
                >
                    <Text variant="bodyLarge">Käsittelyn osuus kaadosta:</Text>
                    <Chip>{data.kasittely_maara}%</Chip>
                    {/* <Text variant="bodyLarge">{data.kasittely_maara} %</Text> */}
                </View>
                <View style={{ marginTop: 32, marginHorizontal: 24, gap: 4 }}>
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
                                paddingBottom: 8,
                            }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    flex: 3,
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Jaot
                            </Text>
                        </View>
                    </View>
                    <View>
                        {result.isLoading ? <ActivityIndicator /> : null}
                        {result.isError ? (
                            <ErrorScreen error={result.error} />
                        ) : null}
                        {result.isSuccess ? (
                            <>
                                {result.data.length === 0 ? (
                                    <View
                                        style={{
                                            ...styles.shareContainer,
                                            ...styles.shareContainerLast,
                                            backgroundColor:
                                                theme.colors.surface,
                                            borderColor:
                                                theme.colors.surfaceVariant,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 8,
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
                                    <ShareList shares={result.data} />
                                )}
                            </>
                        ) : null}
                    </View>
                </View>
                {/* Buttons */}
                <View
                    style={{
                        ...styles.buttonContainer,
                        // backgroundColor: theme.colors.surface,
                        // borderColor: theme.colors.surfaceVariant,
                    }}
                >
                    <Button
                        mode="contained-tonal"
                        onPress={openBottomSheet}
                        style={styles.button}
                        contentStyle={{ padding: 6 }}
                        icon="view-list"
                    >
                        Kaadon tiedot
                    </Button>
                    <Button
                        mode="elevated"
                        disabled={hasWriteRights}
                        icon={"share"}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                        style={styles.button}
                        contentStyle={{ padding: 6 }}
                        onPress={navigateToForm}
                    >
                        {"Uusi jako"}
                    </Button>
                    {error ? <ErrorScreen error={error} /> : null}
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
        // marginHorizontal: 24,
        // marginVertical: 12,
        // gap: 8,
        // borderRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
    },
    shareContainer: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        paddingBottom: 13,
    },
    shareContainerLast: {
        borderBottomWidth: 1,
        borderBottomEndRadius: 24,
        borderBottomStartRadius: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        marginHorizontal: 24,
        marginVertical: 32,
        // paddingHorizontal: 8,
        // paddingVertical: 12,
        // borderWidth: 1,
        borderRadius: 8,
    },
    button: {
        flex: 1,
        // padding: 6,
        borderRadius: 24,
    },
});
