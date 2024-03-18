import type {
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { FormTypes, ShotFormType, UsageForm } from "./types";

/* 
    This file describes the types of the navigations that the app has and
    what screens each navigation component has and what params do these screens take.
    For example, RootStackParamList describes that it has BottomNavigation screen
    Details screen and Forms screen. And further the Details screen takes
    type, data and title as params. These params are then used in the screens
    rendering logic.
 */

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
    Login: undefined;
    Forms: {
        type: string;
        data?: FormTypes;
        shot?: ShotFormType;
        usage?: UsageForm[];
        clear?: boolean;
        isError?: boolean;
        isSuccess?: boolean;
        errorMessage?: string;
    };
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

// Share tab types
export type ShareTabParamList = {
    Jäsenille: undefined;
    Ryhmille: undefined;
};

export type ShareTabScreenProps<T extends keyof ShareTabParamList> =
    CompositeScreenProps<
        MaterialTopTabScreenProps<ShareTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

// Graph tab types
export type GraphTabParamList = {
    Peura: undefined;
    Hirvi: undefined;
};

export type GraphTabScreenProps<T extends keyof GraphTabParamList> =
    CompositeScreenProps<
        MaterialTopTabScreenProps<GraphTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
