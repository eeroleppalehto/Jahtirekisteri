import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import {
    ActivityIndicator,
    Avatar,
    Divider,
    Text,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { useAuth } from "../../context/AuthProvider";
import IconListItem from "../../components/IconListItem";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Shot = {
    kaato_id: number;
    jasen_id: number;
    kaatopaiva: string;
    paikka_teksti: string;
    paikka_koordinaatti: string | null;
    elaimen_nimi: string;
    sukupuoli: string;
    ikaluokka: string;
    ruhopaino: number;
    lisatieto: string | null;
};

type ProfileScreenQuery = {
    kayttaja: {
        kayttajatunnus: string;
        rooli: string;
        jasen_id: number;
        nimi: string;
        osoite: string | null;
        postinumero: string | null;
        postitoimipaikka: string | null;
        puhelin: string | null;
    };
    kaadot: Shot[];
};

export default function ProfileScreen() {
    const { authState } = useAuth();
    const result = useFetchQuery<ProfileScreenQuery>("auth/userinfo", [
        "Profile",
        authState?.username,
    ]);

    const theme = useTheme();

    const TextAvatar = (name: string) => {
        const names = name.split(" ");
        const firstLetter = names[0].charAt(0).toUpperCase();
        const secondLetter = names[1].charAt(0).toUpperCase();

        return (
            <Avatar.Text
                size={150}
                label={`${secondLetter}${firstLetter}`}
                labelStyle={{ fontSize: 70 }}
            />
        );
    };

    return (
        <>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess ? (
                <ScrollView>
                    <View
                        style={{
                            alignItems: "center",
                            paddingTop: 60,
                        }}
                    >
                        {TextAvatar(result.data.kayttaja.nimi)}
                        <Text
                            variant="headlineMedium"
                            style={{ paddingTop: 60, paddingBottom: 4 }}
                        >{`${result.data.kayttaja.nimi}`}</Text>
                        <Text
                            variant="titleLarge"
                            style={{
                                paddingBottom: 10,
                                color: theme.colors.outline,
                            }}
                        >{`@${result.data.kayttaja.kayttajatunnus}`}</Text>
                    </View>
                    <Text
                        variant="titleMedium"
                        style={{
                            color: theme.colors.primary,
                            paddingLeft: 16,
                            paddingTop: 60,
                        }}
                    >
                        {"Yhteystiedot"}
                    </Text>
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="phone"
                        title="Puhelinnumero"
                        description={result.data.kayttaja.puhelin ?? undefined}
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Osoite"
                        description={result.data.kayttaja.osoite ?? undefined}
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Postinumero"
                        description={
                            result.data.kayttaja.postinumero ?? undefined
                        }
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Postitoimipaikka"
                        description={
                            result.data.kayttaja.postitoimipaikka ?? undefined
                        }
                    />
                    <Divider />
                    <Text
                        variant="titleMedium"
                        style={{
                            color: theme.colors.primary,
                            paddingLeft: 16,
                            paddingTop: 60,
                        }}
                    >
                        {"Omat kaadot"}
                    </Text>
                    {result.data.kaadot.map((kaato) => (
                        <ShotListItem key={kaato.kaato_id} shot={kaato} />
                    ))}
                    <View style={{ padding: 150 }}></View>
                </ScrollView>
            ) : null}
        </>
    );
}

type ShotListItemProps = {
    shot: Shot;
};

function ShotListItem({ shot }: ShotListItemProps) {
    const theme = useTheme();

    // Format date to Finnish format
    const dateStringArray = new Date(shot.kaatopaiva)
        .toLocaleDateString("fi-FI", {
            year: "2-digit",
            month: "short",
            day: "numeric",
        })
        .split(" ");

    const dateString = dateStringArray.toString().replace(/,/g, "");

    // Render icon based on gender value
    const getGenderIcon = (gender: string) => {
        if (gender === "Uros") {
            return (
                <MaterialCommunityIcons
                    name="gender-male"
                    size={20}
                    color={theme.colors.outline}
                />
            );
        } else if (gender === "Naaras") {
            return (
                <MaterialCommunityIcons
                    name="gender-female"
                    size={20}
                    color={theme.colors.outline}
                />
            );
        } else {
            return (
                <MaterialCommunityIcons
                    name="minus"
                    size={20}
                    color={theme.colors.outline}
                />
            );
        }
    };

    // Render avatar based on animal value
    const getAnimalAvatar = (animal: string) => {
        if (animal === "Hirvi") {
            return require("../../../assets/mooseAvatar.jpg");
        } else if (animal === "Valkohäntäpeura") {
            return require("../../../assets/deerAvatar.jpg");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Avatar.Image
                    source={getAnimalAvatar(shot.elaimen_nimi)}
                    size={50}
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.upperText}>
                    <Text variant="bodyLarge">Index: {shot.kaato_id}</Text>
                    <Text variant="bodyMedium" style={{ paddingLeft: 20 }}>
                        {dateString}
                    </Text>
                </View>
                <View style={styles.bottomText}>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                color: theme.colors.outline,
                            }}
                        >
                            {shot.elaimen_nimi}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                color: theme.colors.outline,
                            }}
                        >
                            {shot.ikaluokka}
                        </Text>
                    </View>
                    {getGenderIcon(shot.sukupuoli)}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        gap: 15,
    },
    avatar: {
        paddingTop: 5,
        paddingLeft: 10,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingRight: 5,
    },
    upperText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
