import {
    StyleProp,
    ViewStyle,
    Animated,
    StyleSheet,
    Platform,
    I18nManager,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface Props {
    scrollValue: number;
    type: string;
    label: string;
}

const FloatingActionButton = ({ scrollValue, type, label }: Props) => {
    const extended = scrollValue <= 10;
    const animateFrom = "right";
    const fabStyle = { [animateFrom]: 16 };

    const isIOS = Platform.OS === "ios";

    const navigation = useNavigation();

    return (
        <AnimatedFAB
            icon={"plus"}
            label={label}
            extended={extended}
            onPress={() => navigation.navigate("Forms", { type })}
            visible={true}
            animateFrom={"right"}
            iconMode={"static"}
            style={[styles.fabStyle, {}, { right: 16 }]}
        />
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: "absolute",
    },
});
