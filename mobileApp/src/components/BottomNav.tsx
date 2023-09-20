import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text } from "react-native-paper";

import MaintenanceNav from "./MaintenanceNav";
import { BottomNavParamList } from "../NavigationTypes";

import VictoryTest from "../screens/GraphScreen/VictoryChart";
import VictoryGroupChart from "../screens/GraphScreen/VictoryGroupChart";

const Tab = createMaterialBottomTabNavigator<BottomNavParamList>();

const Placeholder = () => {
    return <Text>Placeholder</Text>;
};

function BottomNav() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Grafiikka" component={VictoryGroupChart} />
            <Tab.Screen name="Kaadot" component={Placeholder} />
            <Tab.Screen name="Ylläpito" component={MaintenanceNav} />
        </Tab.Navigator>
    );
}

export default BottomNav;
