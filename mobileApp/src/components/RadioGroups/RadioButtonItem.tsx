import { Text, TouchableRipple, MD3Theme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type Props = {
    label: string;
    value: string;
    status: "checked" | "unchecked";
    onPress: (value: string) => void;
    theme: MD3Theme;
};

export function RadioButtonItem({
    label,
    value,
    status,
    onPress,
    theme,
}: Props) {
    const handlePress = () => {
        onPress(value);
    };

    const radioButtonIcon =
        status === "checked"
            ? "radio-button-checked"
            : "radio-button-unchecked";

    return (
        <TouchableRipple style={styles.container} onPress={() => handlePress()}>
            <>
                <Text variant="bodyLarge" style={{ fontWeight: "normal" }}>
                    {label}
                </Text>
                <MaterialIcons
                    name={radioButtonIcon}
                    size={26}
                    color={
                        status === "checked"
                            ? theme.colors.primary
                            : theme.colors.outline
                    }
                />
            </>
        </TouchableRipple>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
});
