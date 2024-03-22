import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
import RootStack from "./RootStack";
import ProfileScreen from "../screens/ProfileScreen";
import DrawerAppBar from "../components/AppBars/DrawerAppBar";
import { DrawerParamList } from "../NavigationTypes";
import { ChangePasswordScreen } from "../screens/ChangePasswordScreen";

export type DrawerNavParamList = {
    RootStack: undefined;
    Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNav() {
    return (
        <Drawer.Navigator
            id="DrawerNav"
            initialRouteName="RootStack"
            drawerContent={({ navigation }) => (
                <DrawerContent navigation={navigation} />
            )}
        >
            <Drawer.Screen // Main screen
                name="RootStack"
                component={RootStack}
                options={{
                    headerShown: false,
                }}
            />
            <Drawer.Screen // Screen that shows user profile
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: "Profiili",
                    header: (props) => <DrawerAppBar {...props} />,
                }}
            />
            <Drawer.Screen // Screen that allows user to change their password
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{
                    title: "Vaihda salasana",
                    header: (props) => <DrawerAppBar {...props} />,
                }}
            />
        </Drawer.Navigator>
    );
}

export default DrawerNav;
