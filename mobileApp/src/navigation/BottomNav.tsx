import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaintenanceNav from "./MaintenanceNav";
import ShareNav from "./ShareNav";
import ChartVictoryXL from "../screens/GraphScreen/ChartVictoryXL";
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
                name="Grafiikka"
                component={ChartVictoryXL}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="chart-box-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
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
