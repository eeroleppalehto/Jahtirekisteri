import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { GroupViewQuery } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type navigationProps = MaintenanceTabScreenProps<"Ryhmät">["navigation"];

type Props = {
    group: GroupViewQuery;
    navigation: navigationProps;
};

// ListItem for displaying a single group in a list
function GroupListItem({ group, navigation }: Props) {
    const theme = useTheme();

    // Left trailing icon for the group
    const iconElement = (
        <MaterialCommunityIcons
            name="account-multiple"
            size={24}
            style={{ ...styles.icon, color: theme.colors.primary }}
        />
    );

    return (
        <TouchableRipple
            onPress={() =>
                navigation.navigate("Details", {
                    type: "Ryhmä",
                    data: group,
                    title: group.ryhman_nimi,
                })
            }
        >
            <View style={styles.container}>
                {iconElement}
                <View style={styles.textContainer}>
                    <Text variant="bodyLarge" style={styles.upperText}>
                        {group.ryhman_nimi}
                    </Text>
                    <View style={styles.bottomText}>
                        <Text
                            variant="bodyMedium"
                            style={{
                                ...styles.bottomText,
                                color: theme.colors.outline,
                            }}
                        >
                            {group.jasenia} jäsentä
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                ...styles.bottomText,
                                color: theme.colors.outline,
                            }}
                        >
                            Osuus: {group.osuus_summa ? group.osuus_summa : 0}
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

export default GroupListItem;
