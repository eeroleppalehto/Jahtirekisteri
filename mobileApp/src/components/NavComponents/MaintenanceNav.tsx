import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MemberScreen from "../../screens/MemberScreen";
import GroupScreen from "../../screens/GroupScreen";
import { View, Text } from "react-native";
import ErrorScreen from "../../screens/ErrorScreen";
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

/* 
    Top navigation for the maintenance screens. This component is used to
    navigate between the MemberScreen, GroupScreen and PartyScreen.
 */
function MaintenanceNav() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="Jäsenet" component={MemberScreen} />
            <TopTab.Screen name="Ryhmät" component={GroupScreen} />
            <TopTab.Screen name="Seurueet" component={Empty} />
        </TopTab.Navigator>
    );
}

export default MaintenanceNav;
