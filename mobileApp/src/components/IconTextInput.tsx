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
    let iconElement = <View style={styles.emptyIcon} />;

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
            iconElement = <View style={styles.emptyIcon} />;
            break;
    }

    const title = required ? (
        <>
            <Text style={{}}>{label}</Text>
            <Text style={{ color: theme.colors.error }}>*</Text>
        </>
    ) : (
        <Text style={{}}>{label}</Text>
    );

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
