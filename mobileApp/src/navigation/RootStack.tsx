import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";

import BottomNav from "./BottomNav";
import DetailsScreen from "../screens/Details/DetailsScreen";
import { CustomAppBar } from "../components/AppBars/CustomAppBar";
import { useAuth } from "../context/AuthProvider";
import LoginScreen from "../screens/LoginScreen";
import LoginAppBar from "../components/AppBars/LoginAppBar";
import MemberForm from "../screens/Forms/MemberForm";
import MemberFormAppBar from "../components/AppBars/FormAppBars/MemberFormAppBar";
import { GroupForm } from "../screens/Forms/GroupForm";
import GroupFormAppBar from "../components/AppBars/FormAppBars/GroupFormAppBar";
import { PartyForm } from "../screens/Forms/PartyForm";
import PartyFormAppBar from "../components/AppBars/FormAppBars/PartyFormAppBar";
import { GroupShareForm } from "../screens/Forms/GroupShareForm";
import GroupShareFormAppBar from "../components/AppBars/FormAppBars/GroupShareFormAppBar";
import { MemberShareForm } from "../screens/Forms/MemberShareForm";
import MemberShareFormAppBar from "../components/AppBars/FormAppBars/MemberShareFormAppBar";
import { MembershipForm } from "../screens/Forms/MembershipForm";
import MembershipFormAppBar from "../components/AppBars/FormAppBars/MembershipFormApp";
import ShotForm from "../screens/Forms/ShotForm";
import ShotFormAppBar from "../components/AppBars/FormAppBars/ShotFormAppBar";

import { RootStackParamList } from "../NavigationTypes";
import DetailsAppBar from "../components/AppBars/DetailsAppBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

/* 
    The RootStack component is used to render the main bottom navigation of 
    the app and the screens that are accessed through it like the DetailsScreen
    and FormScreen.
*/
function RootStack() {
    const { authState } = useAuth();
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
            {authState?.authenticated ? (
                <>
                    <Stack.Screen
                        name="BottomNavigation"
                        component={BottomNav}
                        options={{
                            header: (props) => <CustomAppBar {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name="Details"
                        component={DetailsScreen}
                        options={{
                            header: (props) => <DetailsAppBar {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name="MemberForm"
                        component={MemberForm}
                        options={{
                            header: (props) => <MemberFormAppBar {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name="GroupForm"
                        component={GroupForm}
                        options={{
                            header: (props) => <GroupFormAppBar {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name="PartyForm"
                        component={PartyForm}
                        options={{
                            header: (props) => <PartyFormAppBar {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name="GroupShareForm"
                        component={GroupShareForm}
                        options={{
                            header: (props) => (
                                <GroupShareFormAppBar {...props} />
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="MemberShareForm"
                        component={MemberShareForm}
                        options={{
                            header: (props) => (
                                <MemberShareFormAppBar {...props} />
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="MembershipForm"
                        component={MembershipForm}
                        options={{
                            header: (props) => (
                                <MembershipFormAppBar {...props} />
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="ShotForm"
                        component={ShotForm}
                        options={{
                            header: (props) => <ShotFormAppBar {...props} />,
                        }}
                    />
                </>
            ) : (
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        header: (props) => <LoginAppBar {...props} />,
                    }}
                />
            )}
        </Stack.Navigator>
    );
}

export default RootStack;
