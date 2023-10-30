import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MemberScreen from "../../screens/MemberScreen";
import { View, Text } from "react-native";

import { MaintenanceTabParamList } from "../../NavigationTypes";

const TopTab = createMaterialTopTabNavigator<MaintenanceTabParamList>();

const Empty = () => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Empty</Text>
        </View>
    );
};

function MaintenanceNav() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="Jäsenet" component={MemberScreen} />
            <TopTab.Screen name="Ryhmät" component={Empty} />
            <TopTab.Screen name="Seurueet" component={Empty} />
        </TopTab.Navigator>
    );
}

export default MaintenanceNav;
