import type {
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import type { DrawerScreenProps } from "@react-navigation/drawer";

// Drawer types
export type DrawerParamList = {
    RootStack: NavigatorScreenParams<RootStackParamList>;
    Profile: undefined;
};

export type MyDrawerScreenProps<T extends keyof DrawerParamList> =
    DrawerScreenProps<DrawerParamList, T>;

// Root types
export type RootStackParamList = {
    BottomNavigation: NavigatorScreenParams<BottomNavParamList>;
    Details: { type: string; data: any; title: string };
    Forms: { type: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    CompositeScreenProps<
        NativeStackScreenProps<RootStackParamList, T>,
        DrawerScreenProps<DrawerParamList>
    >;

// Bottom tab types
export type BottomNavParamList = {
    Grafiikka: undefined;
    Kaadot: undefined;
    Jako: undefined;
    Ylläpito: NavigatorScreenParams<MaintenanceTabParamList>;
};

export type BottomTabScreenProps<T extends keyof BottomNavParamList> =
    CompositeScreenProps<
        MaterialBottomTabScreenProps<BottomNavParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

// Maintenance tab types
export type MaintenanceTabParamList = {
    Jäsenet: { data: any } | undefined;
    Ryhmät: undefined;
    Seurueet: undefined;
};

export type MaintenanceTabScreenProps<T extends keyof MaintenanceTabParamList> =
    CompositeScreenProps<
        MaterialTopTabScreenProps<MaintenanceTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

///////////////////////////
// export type HomeTabParamList = {
//     Popular: undefined;
//     Latest: undefined;
// };

// export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
//     CompositeScreenProps<
//         MaterialBottomTabScreenProps<HomeTabParamList, T>,
//         RootStackScreenProps<keyof RootStackParamList>
//     >;
///////////////////////////
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
