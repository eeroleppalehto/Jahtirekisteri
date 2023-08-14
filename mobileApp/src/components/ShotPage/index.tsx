import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHeaderTitle } from '@react-navigation/elements';

import MemberPage from './MemberPage';
import MemberDetails from './MemberDetails';

const Stack = createStackNavigator();

function CustomNavigationBar({ navigation, route, options, back }: any) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

function ShotStack() {
  return (
    <Stack.Navigator
        initialRouteName="Shots"
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}>
      <Stack.Screen
        name="Shots"
        component={MemberPage}
        //options={{ headerTitle: 'Twitter' }}
      />
      <Stack.Screen
        name="Details"
        component={MemberDetails}
        //options={{ headerTitle: 'Tweet' }}
      />
    </Stack.Navigator>
  );
};

export default ShotStack;