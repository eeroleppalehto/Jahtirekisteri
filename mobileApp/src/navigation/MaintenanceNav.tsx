import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MemberScreen from "../screens/MemberScreen";
import GroupScreen from "../screens/GroupScreen";
import PartyScreen from "../screens/PartyScreen";
import { useTheme } from "react-native-paper";
import ErrorScreen from "../screens/ErrorScreen";
import { MaintenanceTabParamList } from "../NavigationTypes";

const TopTab = createMaterialTopTabNavigator<MaintenanceTabParamList>();

/**
 * Top navigation for the maintenance screens. This component is used to
 * navigate between the MemberScreen, GroupScreen and PartyScreen.
 * @date 11/21/2023 - 11:19:22 AM
 *
 */
function MaintenanceNav() {
    const theme = useTheme();
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primary,
                },
            }}
        >
            <TopTab.Screen name="Jäsenet" component={MemberScreen} />
            <TopTab.Screen name="Ryhmät" component={GroupScreen} />
            <TopTab.Screen name="Seurueet" component={PartyScreen} />
        </TopTab.Navigator>
    );
}

export default MaintenanceNav;
