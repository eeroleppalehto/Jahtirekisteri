// THIS IS A TEST COMPONENT FOR THE BOTTOM NAVIGATION. THIS COMPONENT IS NOT USED IN THE APP.
// Reason for this is that the Victory Native XL chart library is not currently working with jest.

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaintenanceNav from "../components/NavComponents/MaintenanceNav";
import ShareNav from "../components/NavComponents/ShareNav";
import ShotScreen from "../screens/ShotScreen";
import { BottomNavParamList } from "../NavigationTypes";

const Tab = createMaterialBottomTabNavigator<BottomNavParamList>();

/* 
    The main component of the app. This component is used to navigate between
    the main screens of the app. The screens are Grafiikka, Kaadot,
    Jako and Ylläpito.
*/

function BottomNav() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Kaadot"
                component={ShotScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="crosshairs"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Jako"
                component={ShareNav}
                options={{
                    tabBarLabel: "Jako",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="share"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Ylläpito"
                component={MaintenanceNav}
                options={{
                    tabBarTestID: "TestTab",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account-group"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomNav;
