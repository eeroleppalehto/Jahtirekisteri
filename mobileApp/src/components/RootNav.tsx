import React from 'react';
import { Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNav from './BottomNav';
import DrawerContent from './DrawerContent';
import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';


const Drawer = createDrawerNavigator();

function CustomNavigationBar({ navigation, route, options, back }: any) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

function RootNav() {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent />}
      screenOptions={{
        /* headerShown: false, */
        header: (props) => <CustomNavigationBar {...props} />,
      }}
      >
      <Drawer.Screen name="Placeholder" component={BottomNav} />
    </Drawer.Navigator>
  );
}

export default RootNav;