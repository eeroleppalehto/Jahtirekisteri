import { View } from "react-native";
import { Text, Avatar, MD3Colors, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Kaato } from "../../types";

type Props = {
    shot: Kaato;
};

function ShotListItem({ shot }: Props) {
    const dateStringArray = new Date(shot.kaatopaiva)
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
                    color={MD3Colors.neutral30}
                />
            );
        } else if (gender === "Naaras") {
            return (
                <MaterialCommunityIcons
                    name="gender-female"
                    size={20}
                    color={MD3Colors.neutral30}
                    style={{ flexGrow: 0 }}
                />
            );
        } else {
            return (
                <MaterialCommunityIcons
                    name="minus"
                    size={20}
                    color={MD3Colors.neutral30}
                />
            );
        }
    };

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
                                    color: MD3Colors.neutral40,
                                }}
                            >
                                Miika Hiivola
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
                                    color: MD3Colors.neutral40,
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
        paddingVertical: 12,
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
