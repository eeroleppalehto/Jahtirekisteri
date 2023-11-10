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

    const iconStyle = icon ? styles.icon : styles.emptyIcon;

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
