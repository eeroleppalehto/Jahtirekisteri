import MemberDetails from "./MemberDetails";
import ShotDetails from "./ShotDetails";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

import {
    MaintenanceTabScreenProps,
    BottomTabScreenProps,
    RootStackScreenProps,
} from "../../NavigationTypes";

const ErrorScreen = () => {
    return (
        <View>
            <Text>Virhe!</Text>
        </View>
    );
};

type Props = RootStackScreenProps<"Details">;

function DetailsScreen({ route }: Props) {
    if (!route.params?.type) return <ErrorScreen />;
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
            case "Kaato":
                const shotRoute =
                    useRoute<BottomTabScreenProps<"Kaadot">["route"]>();
                navigation =
                    useNavigation<
                        BottomTabScreenProps<"Kaadot">["navigation"]
                    >();
                return (
                    <ShotDetails route={shotRoute} navigation={navigation} />
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
