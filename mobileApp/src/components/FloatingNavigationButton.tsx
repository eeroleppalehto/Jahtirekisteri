import {
    StyleProp,
    ViewStyle,
    Animated,
    StyleSheet,
    Platform,
    I18nManager,
} from "react-native";
import { AnimatedFAB, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthProvider";
import { WRITE_RIGHTS_SET } from "../utils/authenticationUtils";

type NavPath =
    | "MemberForm"
    | "GroupForm"
    | "PartyForm"
    | "ShotForm"
    | "MembershipForm"
    | "MemberShareForm"
    | "GroupShareForm";

interface Props {
    navPath: NavPath;
    scrollValue: number;
    label: string;
    type: string;
    method: string;
    // onPress: () => void;
}

/**
 * Floating navigation button that opens a form from the bottom navigation.
 * @date 11/10/2023 - 1:23:33 PM
 *
 * @param {number} scrollValue Value for determining if the button should be extended or not
 * @param {string} type Type of the form to open
 * @param {string} label Label for the button
 * @returns {*}
 */

function FloatingNavigationButton({
    navPath,
    scrollValue,
    method,
    label,
}: Props) {
    const extended = scrollValue <= 10; // If scrollValue is less than 10, extend the button
    const animateFrom = "right";
    const fabStyle = { [animateFrom]: 16 };

    const isIOS = Platform.OS === "ios";

    const theme = useTheme();

    const { authState } = useAuth();

    const hasWriteRights = authState?.role
        ? WRITE_RIGHTS_SET.has(authState.role)
        : false;

    // Get navigation object from react navigation
    // TODO: See if navigation can be passed as a prop
    const navigation = useNavigation();

    return (
        <>
            {hasWriteRights ? (
                <AnimatedFAB
                    icon={"plus"}
                    label={label}
                    extended={extended}
                    onPress={() =>
                        navigation.navigate(navPath, {
                            method,
                            id: undefined,
                            isError: false,
                            clearFields: false,
                            isSuccess: false,
                            errorMessage: "",
                        })
                    }
                    visible={true}
                    animateFrom={"right"}
                    iconMode={"dynamic"}
                    color={theme.colors.onPrimary}
                    style={[
                        styles.fabStyle,
                        {},
                        {
                            right: 16,
                            backgroundColor: theme.colors.primary,
                        },
                    ]}
                />
            ) : null}
        </>
    );
}

export default FloatingNavigationButton;

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
