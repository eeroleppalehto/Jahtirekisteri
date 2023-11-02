import { View, StyleSheet } from "react-native";
import { TextInput, MD3Colors, useTheme, Text } from "react-native-paper";
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
}: Props) {
    const theme = useTheme();
    let iconElement = <View style={styles.emptyIcon} />;

    switch (iconSet) {
        case "MaterialIcons":
            iconElement = (
                <MaterialIcons
                    name={iconNameMaterial}
                    size={24}
                    style={{ ...styles.icon, color: MD3Colors.neutral40 }}
                />
            );
            break;
        case "MaterialCommunityIcons":
            iconElement = (
                <MaterialCommunityIcons
                    name={iconNameMaterialCommunity}
                    size={24}
                    style={{ ...styles.icon, color: MD3Colors.neutral40 }}
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

    return (
        <View style={styles.inputContainer}>
            {iconElement}
            <TextInput
                mode="outlined"
                label={title}
                value={value}
                onChangeText={(text) => onChangeText(text)}
                keyboardType={inputType}
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
