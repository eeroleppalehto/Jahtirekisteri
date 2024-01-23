import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
import RootStack from "./RootStack";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileAppBar from "../components/AppBars/ProfileAppBar";
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
                    header: (props) => <ProfileAppBar {...props} />,
                }}
            />
            {/* <Drawer.Screen // Screen that shows user profile
                name="Login"
                component={LoginScreen}
                options={{
                    header: (props) => <LoginAppBar {...props} />,
                }}
            /> */}
        </Drawer.Navigator>
    );
}

export default DrawerNav;
