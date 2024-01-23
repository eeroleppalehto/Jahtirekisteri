import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import { ShareTabParamList } from "../NavigationTypes";
import ErrorScreen from "../screens/ErrorScreen";
import GroupShareScreen from "../screens/GroupShareScreen";
import MemberShareScreen from "../screens/MemberShareScreen";

const TopTab = createMaterialTopTabNavigator<ShareTabParamList>();

/**
 * Top navigation for the share screens. This component is used to
 * navigate between the MemberShareScreen and GroupShareScreen.
 * @date 11/21/2023 - 11:22:58 AM
 *
 */
function ShareNav() {
    const theme = useTheme();
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primary,
                },
            }}
        >
            <TopTab.Screen name="Jäsenille" component={MemberShareScreen} />
            <TopTab.Screen name="Ryhmille" component={GroupShareScreen} />
        </TopTab.Navigator>
    );
}

export default ShareNav;
