import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text } from "react-native-paper";

import MaintenanceNav from "./MaintenanceNav";
import { BottomNavParamList } from "../NavigationTypes";

const Tab = createMaterialBottomTabNavigator<BottomNavParamList>();

const Placeholder = () => {
    return <Text>Placeholder</Text>;
};

function BottomNav() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Grafiikka" component={Placeholder} />
            <Tab.Screen name="Kaadot" component={Placeholder} />
            <Tab.Screen name="Ylläpito" component={MaintenanceNav} />
        </Tab.Navigator>
    );
}

export default BottomNav;
