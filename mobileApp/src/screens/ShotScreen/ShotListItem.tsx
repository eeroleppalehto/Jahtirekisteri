import { View } from "react-native";
import { Text, Avatar, TouchableRipple, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { ShotViewQuery } from "../../types";
import { BottomTabScreenProps } from "../../NavigationTypes";

type navigationProps = BottomTabScreenProps<"Kaadot">["navigation"];

type Props = {
    shot: ShotViewQuery;
    navigation: navigationProps;
};

// ListItem for displaying a single shot in a list
function ShotListItem({ shot, navigation }: Props) {
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
        <TouchableRipple
            onPress={() =>
                navigation.navigate("Details", {
                    type: "Kaato",
                    data: shot,
                    title: `Kaato Index: ${shot.kaato_id}`,
                })
            }
        >
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
                                {shot.kaatajan_nimi}
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
        </TouchableRipple>
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

export default ShotListItem;
