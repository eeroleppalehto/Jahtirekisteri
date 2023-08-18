import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';


import RootStack from './RootStack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileAppBar from '../screens/ProfileScreen/ProfileAppBar';


const Drawer = createDrawerNavigator();

function DrawerNav() {
    return (
        <Drawer.Navigator
                drawerContent={({navigation}) => <DrawerContent navigation={navigation}/>}
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
                    header: ({ navigation }) => <ProfileAppBar navigation={navigation} />,
                }}

            />
        </Drawer.Navigator>
    );
}

export default DrawerNav;