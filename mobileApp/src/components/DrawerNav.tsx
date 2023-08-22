import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./DrawerContent";

import RootStack from "./RootStack";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileAppBar from "../screens/ProfileScreen/ProfileAppBar";

import { DrawerParamList } from "../NavigationTypes";

export type DrawerNavParamList = {
    RootStack: undefined;
    Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNav() {
    return (
        <Drawer.Navigator
            id="DrawerNav"
            drawerContent={({ navigation }) => (
                <DrawerContent navigation={navigation} />
            )}
        >
            <Drawer.Screen
                name="RootStack"
                component={RootStack}
                options={{
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    header: (props) => <ProfileAppBar {...props} />,
                }}
            />
        </Drawer.Navigator>
    );
}

export default DrawerNav;
