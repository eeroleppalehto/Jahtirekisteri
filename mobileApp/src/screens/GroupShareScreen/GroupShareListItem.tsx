import { View, StyleSheet } from "react-native";
import {
    Avatar,
    useTheme,
    TouchableRipple,
    Text,
    Surface,
} from "react-native-paper";
import { ShareViewQuery } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    share: ShareViewQuery;
};

// List item for displaying a single share meant for group in a list
function GroupShareListItem({ share }: Props) {
    const theme = useTheme();

    // Format date to Finnish format
    const dateStringArray = new Date(share.kaatopaiva)
        .toLocaleDateString("fi-FI", {
            year: "2-digit",
            month: "short",
            day: "numeric",
        })
        .split(" ");

    const dateString = dateStringArray.toString().replace(/,/g, "");

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
                    style={{ flexGrow: 0 }}
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
        <TouchableRipple onPress={() => console.log("pressed")}>
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Avatar.Image
                        source={getAnimalAvatar(share.elaimen_nimi)}
                        size={50}
                    />
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.upperText}>
                        <View style={{ flex: 1 }}>
                            <Text variant="bodyLarge">
                                Index: {share.kaato_id}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Text variant="bodyMedium">{dateString}</Text>
                        </View>
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
                                {share.kaataja}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                gap: 5,
                            }}
                        >
                            <Text
                                variant="bodyMedium"
                                style={{
                                    color: theme.colors.outline,
                                }}
                            >
                                {share.ikaluokka}
                            </Text>
                            {getGenderIcon(share.sukupuoli)}
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text>{"Jaettu:"}</Text>
                    <Surface
                        elevation={2}
                        style={{
                            alignItems: "center",
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                            width: 60,
                            borderRadius: 15,
                            backgroundColor: theme.colors.primary,
                        }}
                    >
                        <Text style={{ color: theme.colors.surface }}>
                            {share.jaettu_pros
                                ? share.jaettu_pros.toString()
                                : "0"}
                            {"%"}
                        </Text>
                    </Surface>
                </View>
            </View>
        </TouchableRipple>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        gap: 15,
        paddingRight: 10,
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

export default GroupShareListItem;
