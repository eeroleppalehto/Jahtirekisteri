import {
    StyleProp,
    ViewStyle,
    Animated,
    StyleSheet,
    Platform,
    I18nManager,
} from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface Props {
    scrollValue: number;
    type: string;
    label: string;
    icon: string;
    onPress: () => void;
    position?: "left" | "right";
}

// TODO: Refactor from arrow function to regular function
// TODO: Is this component needed? If not, remove it

const FloatingActionButton = ({
    scrollValue,
    type,
    label,
    icon,
    onPress,
    position = "right",
}: Props) => {
    const extended = scrollValue <= 10;
    const animateFrom = "right";
    const fabStyle = { [animateFrom]: 16 };
    const theme = useTheme();
    const isIOS = Platform.OS === "ios";

    const navigation = useNavigation();

    return (
        <FAB
            label={label}
            onPress={onPress}
            visible={true}
            variant="primary"
            color={theme.colors.onPrimary}
            style={[
                { ...styles.fabStyle, backgroundColor: theme.colors.primary },
                {},
                {},
            ]}
        />
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    fabStyle: {
        bottom: 20,
        marginHorizontal: 55,
        left: 0,
        right: 0,
        // right: 16,
        position: "absolute",
    },
});
