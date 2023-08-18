import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { getHeaderTitle } from "@react-navigation/elements";


import BottomNav from "./BottomNav";
import DetailsScreen from "./DetailsScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";

function myGetHeaderTitle(route: any) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Jäsen';
    // console.log(routeName);
    switch (routeName) {
        case 'Ylläpito':
            return 'Ylläpito';
        case 'Kaadot':
            return 'Kaadot';
        case 'Grafiikka':
            return 'Grafiikka';
        case 'Jäsen':
            return 'Jäsen';
    }
}


function CustomNavigationBar({ navigation, route, options, back }: any) {
    //const title = getHeaderTitle(options, route.name);
    
    const title = myGetHeaderTitle(route);

    return (
        <Appbar.Header>
            {back 
            ? <Appbar.BackAction onPress={navigation.goBack} /> 
            : <Appbar.Action icon="account-circle" onPress={() => navigation.toggleDrawer()} />}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}

type RootStackParamList = {
    BottomNavigation: undefined;
    Details: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'BottomNavigation'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
    return (
        <Stack.Navigator 
            initialRouteName="BottomNavigation"
            screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
            }}
            >
            <Stack.Screen 
                name="BottomNavigation" 
                component={BottomNav}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    )
}

export default RootStack;