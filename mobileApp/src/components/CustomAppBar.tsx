import { Appbar } from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { useNavigation } from "@react-navigation/core";
import { Route } from "@react-navigation/native";

import { RootStackScreenProps } from "../NavigationTypes";

function myGetHeaderTitle(route: Route<string>) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Grafiikka";

    switch (routeName) {
        case "Ylläpito":
            return "Ylläpito";
        case "Kaadot":
            return "Kaadot";
        case "Grafiikka":
            return "Grafiikka";
        case "Jäsen":
            return "Jäsen";
        default:
            return routeName;
    }
}

type NavigationBarProps =
    RootStackScreenProps<"BottomNavigation">["navigation"];

type Props = NativeStackHeaderProps;

export function CustomAppBar({ navigation, route, options, back }: Props) {
    //const title = getHeaderTitle(options, route.name);
    const drawerNavigation = useNavigation<NavigationBarProps>();

    const title = myGetHeaderTitle(route);

    return (
        <Appbar.Header>
            {back ? (
                <Appbar.BackAction onPress={navigation.goBack} />
            ) : (
                <Appbar.Action
                    icon="account-circle"
                    onPress={() => drawerNavigation.toggleDrawer()}
                />
            )}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}
