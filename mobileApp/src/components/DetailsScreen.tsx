import MemberDetails from "../screens/MemberScreen/MemberDetails";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

import {
    MaintenanceTabScreenProps,
    RootStackScreenProps,
} from "../NavigationTypes";

const ErrorScreen = () => {
    return (
        <View>
            <Text>Virhe!</Text>
        </View>
    );
};

type Props =
    | RootStackScreenProps<"Details">
    | MaintenanceTabScreenProps<"Jäsenet">;

function DetailsScreen({ route }: Props) {
    if (!route.params) return <ErrorScreen />;
    try {
        const { type } = route.params;
        let navigation;
        switch (type) {
            case "Jäsen":
                const memberRoute =
                    useRoute<MaintenanceTabScreenProps<"Jäsenet">["route"]>();
                navigation =
                    useNavigation<
                        MaintenanceTabScreenProps<"Jäsenet">["navigation"]
                    >();
                return (
                    <MemberDetails
                        route={memberRoute}
                        navigation={navigation}
                    />
                );
            default:
                return <ErrorScreen />;
        }
    } catch (error) {
        console.log("Screen type not found");
        return <ErrorScreen />;
    }
}

export default DetailsScreen;
