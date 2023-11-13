import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MaintenanceNav from "./MaintenanceNav";
import { BottomNavParamList } from "../../NavigationTypes";

import ChartVictoryXL from "../../screens/GraphScreen/ChartVictoryXL";
import ShotScreen from "../../screens/ShotScreen";

const Tab = createMaterialBottomTabNavigator<BottomNavParamList>();

const Placeholder = () => {
    return <Text>Placeholder</Text>;
};

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
                component={Placeholder}
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
