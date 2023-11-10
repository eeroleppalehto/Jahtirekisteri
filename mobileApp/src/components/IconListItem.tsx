import { Text, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
type MaterialCommunityIconNames = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
    iconSet: "MaterialIcons" | "MaterialCommunityIcons" | "NoIcon";
    iconNameMaterial?: MaterialIconNames;
    iconNameMaterialCommunity?: MaterialCommunityIconNames;
    title: string;
    description: string | undefined;
};

/**
 * Description placeholder
 * @date 11/10/2023 - 1:27:38 PM
 *
 * @param {("MaterialIcons" | "MaterialCommunityIcons" | "NoIcon")} iconSet Icon set to use. Currently supported: MaterialIcons, MaterialCommunityIcons, NoIcon
 * @param {(string | undefined)} iconNameMaterial If iconSet is MaterialIcons, this is the name of the icon to use
 * @param {(string | undefined)} iconNameMaterialCommunity If iconSet is MaterialCommunityIcons, this is the name of the icon to use
 * @param {*} icon Icon React component to display
 * @param {string} title Title of the list item
 * @param {string} description Description of the list item
 * @returns {*}
 */
function IconListItem({
    iconSet,
    iconNameMaterial,
    iconNameMaterialCommunity,
    title,
    description,
}: Props) {
    const theme = useTheme();

    // Initialize icon element to empty icon
    let iconElement = <View style={styles.emptyIcon} />;
    // Switch case for selecting the correct icon element
    switch (iconSet) {
        case "MaterialIcons":
            iconElement = (
                <MaterialIcons
                    name={iconNameMaterial}
                    size={24}
                    style={{ ...styles.icon, color: theme.colors.outline }}
                />
            );
            break;
        case "MaterialCommunityIcons":
            iconElement = (
                <MaterialCommunityIcons
                    name={iconNameMaterialCommunity}
                    size={24}
                    style={{ ...styles.icon, color: theme.colors.outline }}
                />
            );
            break;
        default:
            break;
    }

    // Generate description text element
    // If description is null, use italic text with "Ei tietoja" as the text
    const DescriptionText = description ? (
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            {description}
        </Text>
    ) : (
        <Text
            variant="bodyMedium"
            style={{ color: theme.colors.outline, fontStyle: "italic" }}
        >
            Ei tietoja
        </Text>
    );

    // // Generate icon style based on if icon is defined or not
    // const iconStyle = icon ? styles.icon : styles.emptyIcon;

    return (
        <View style={styles.container}>
            {iconElement}
            <View style={{}}>
                <Text variant="bodyLarge">{title}</Text>
                {DescriptionText}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 14,
        paddingRight: 15,
    },
    emptyIcon: {
        paddingTop: 5,
        paddingLeft: 26,
        paddingRight: 28,
        width: 24,
        height: 24,
    },
    // textContainer: {
    //     flex: 1,
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     paddingRight: 5,
    // },
    // upperText: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // },
    // bottomText: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // },
});

export default IconListItem;
