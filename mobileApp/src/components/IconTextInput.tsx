import { View, StyleSheet } from "react-native";
import { TextInput, useTheme, Text } from "react-native-paper";
import { TextInputProps } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
type MaterialCommunityIconNames = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
    iconSet: "MaterialIcons" | "MaterialCommunityIcons" | "NoIcon";
    iconNameMaterial?: MaterialIconNames;
    iconNameMaterialCommunity?: MaterialCommunityIconNames;
    label: string;
    required: boolean;
    inputType: TextInputProps["keyboardType"];
    value: string | undefined;
    onChangeText: (text: string) => void;
    multiline?: boolean;
};

/**
 * Description placeholder
 * @date 11/10/2023 - 1:37:10 PM
 *
 * @param {("MaterialIcons" | "MaterialCommunityIcons" | "NoIcon")} iconSet Icon set to use. Currently supported: MaterialIcons, MaterialCommunityIcons, NoIcon
 * @param {(string | undefined)} iconNameMaterial If iconSet is MaterialIcons, this is the name of the icon to use
 * @param {(string | undefined)} iconNameMaterialCommunity If iconSet is MaterialCommunityIcons, this is the name of the icon to use
 * @param {string} label Label of the input
 * @param {boolean} required Is the input required
 * @param {TextInputProps} inputType Type of the keyboard to use
 * @param {string} value Value of the input
 * @param {(text: string) => void} onChangeText Callback function for when the text changes
 * @param {boolean} multiline Is the input multiline
 * @returns {*}
 */
function IconTextInput({
    iconSet,
    iconNameMaterial,
    iconNameMaterialCommunity,
    label,
    required,
    inputType,
    value,
    onChangeText,
    multiline,
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

    // Generate title element
    // If required is true, add a red asterisk to the end of the title
    const title = required ? (
        <>
            <Text style={{}}>{label}</Text>
            <Text style={{ color: theme.colors.error }}>*</Text>
        </>
    ) : (
        <Text style={{}}>{label}</Text>
    );

    // Generate number of lines for multiline input
    const numberOfLines = multiline ? 4 : 1;

    return (
        <View style={styles.inputContainer}>
            {iconElement}
            <TextInput
                mode="outlined"
                label={title}
                value={value}
                onChangeText={(text) => onChangeText(text)}
                keyboardType={inputType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                style={{
                    marginRight: 54,
                    flexGrow: 1,
                    backgroundColor: theme.colors.surface,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingRight: 5,
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
});

export default IconTextInput;
