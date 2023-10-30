import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";

import BottomNav from "./BottomNav";
import DetailsScreen from "../DetailsScreen";
import { CustomAppBar } from "../AppBars/CustomAppBar";
import FormScreen from "../FormScreen";
import FormAppBar from "../AppBars/FormAppBar";

import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../NavigationTypes";
import DetailsAppBar from "../AppBars/DetailsAppBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="BottomNavigation"
            screenOptions={
                {
                    // headerShown: false,
                    // header: (props) => <CustomAppBar {...props} />,
                }
            }
        >
            <Stack.Screen
                name="BottomNavigation"
                component={BottomNav}
                options={{
                    header: (props: NativeStackHeaderProps) => (
                        <CustomAppBar {...props} />
                    ),
                }}
            />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                    header: (props: NativeStackHeaderProps) => (
                        <DetailsAppBar {...props} />
                    ),
                }}
            />

            {/*TODO: Confirgure AppBar for DetailsScreen*/}
            <Stack.Screen
                name="Forms"
                component={FormScreen}
                options={{
                    header: (props: NativeStackHeaderProps) => (
                        <FormAppBar {...props} />
                    ),
                }}
            />
        </Stack.Navigator>
    );
}

export default RootStack;
