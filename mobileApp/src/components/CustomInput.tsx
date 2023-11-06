import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
type MaterialCommunityIconNames = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
    iconSet: "MaterialIcons" | "MaterialCommunityIcons" | "NoIcon";
    iconNameMaterial?: MaterialIconNames;
    iconNameMaterialCommunity?: MaterialCommunityIconNames;
    title: string;
    valueState: string | undefined;
    placeholder?: string;
    required: boolean;
    onPress: () => void;
    iconButtonName: MaterialCommunityIconNames;
    enabled?: boolean;
};

function CustomInput({
    iconSet,
    iconNameMaterial,
    iconNameMaterialCommunity,
    title,
    required,
    valueState,
    placeholder,
    onPress,
    iconButtonName,
    enabled,
}: Props) {
    const theme = useTheme();

    const outlineColor = theme.colors.outline;

    let iconElement = <View style={styles.emptyIcon} />;

    switch (iconSet) {
        case "MaterialIcons":
            iconElement = (
                <MaterialIcons
                    name={iconNameMaterial}
                    size={24}
                    style={{ ...styles.icon, color: outlineColor }}
                />
            );
            break;
        case "MaterialCommunityIcons":
            iconElement = (
                <MaterialCommunityIcons
                    name={iconNameMaterialCommunity}
                    size={24}
                    style={{ ...styles.icon, color: outlineColor }}
                />
            );
            break;
        default:
            iconElement = <View style={styles.emptyIcon} />;
            break;
    }

    let checkEnabled = false;
    if (enabled === undefined) {
        checkEnabled = true;
    } else {
        checkEnabled = enabled;
    }

    const valueJSX = valueState ? (
        <Text variant="bodyMedium" style={{ color: outlineColor }}>
            {valueState}
        </Text>
    ) : (
        <Text
            variant="bodyMedium"
            style={{ color: outlineColor, fontStyle: "italic" }}
        >
            {placeholder ? placeholder : "Ei valittu"}
        </Text>
    );

    return (
        <View style={styles.inputContainer}>
            {iconElement}
            <View
                style={{
                    flexGrow: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: checkEnabled
                                    ? theme.colors.onBackground
                                    : outlineColor,
                            }}
                        >
                            {title}
                        </Text>
                        {required ? (
                            <Text
                                variant="bodyMedium"
                                style={{
                                    color: checkEnabled
                                        ? theme.colors.error
                                        : outlineColor,
                                }}
                            >
                                *
                            </Text>
                        ) : null}
                    </View>
                    {valueJSX}
                </View>
                <IconButton
                    mode="contained"
                    disabled={!checkEnabled}
                    icon={iconButtonName}
                    iconColor={theme.colors.onPrimary}
                    containerColor={theme.colors.primary}
                    onPress={() => onPress()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        //paddingRight: 5,
        paddingRight: 55,
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 14,
        paddingRight: 16,
    },
    emptyIcon: {
        paddingTop: 5,
        paddingLeft: 26,
        paddingRight: 28,
        minWidth: 24,
        minHeight: 24,
    },
});

export default CustomInput;
