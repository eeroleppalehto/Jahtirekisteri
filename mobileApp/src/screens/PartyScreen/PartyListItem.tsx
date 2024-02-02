import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PartyViewQuery } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type navigationProps = MaintenanceTabScreenProps<"Seurueet">["navigation"];

type Props = {
    party: PartyViewQuery;
    navigation: navigationProps;
};

// ListItem for displaying a single party in a list
function PartyListItem({ party, navigation }: Props) {
    const theme = useTheme();

    // Left trailing icon for the party
    const iconElement = (
        <MaterialCommunityIcons
            name="account-group"
            size={24}
            style={{ ...styles.icon, color: theme.colors.primary }}
        />
    );

    return (
        <TouchableRipple
            onPress={() =>
                navigation.navigate("Details", {
                    type: "Party",
                    data: party,
                    title: party.seurueen_nimi,
                })
            }
        >
            <View style={styles.container}>
                {iconElement}
                <View style={styles.textContainer}>
                    <Text variant="bodyLarge" style={styles.upperText}>
                        {party.seurueen_nimi}
                    </Text>
                    <View style={styles.bottomText}>
                        <Text
                            variant="bodyMedium"
                            style={{
                                ...styles.bottomText,
                                color: theme.colors.outline,
                            }}
                        >
                            {"Seurueenjohtaja:"}
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                ...styles.bottomText,
                                color: theme.colors.outline,
                            }}
                        >
                            {party.seurueen_johatajan_nimi}
                        </Text>
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
        paddingRight: 15,
    },
    upperText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 14,
        paddingRight: 15,
    },
    divider: {
        marginHorizontal: 50,
    },
});

export default PartyListItem;
