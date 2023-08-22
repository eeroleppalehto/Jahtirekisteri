import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";

import BottomNav from "./BottomNav";
import DetailsScreen from "./DetailsScreen";
import { CustomNavigationBar } from "./CustomNavigationBar";

import { RootStackParamList } from "../NavigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="BottomNavigation"
            screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
            }}
        >
            <Stack.Screen name="BottomNavigation" component={BottomNav} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
}

export default RootStack;
