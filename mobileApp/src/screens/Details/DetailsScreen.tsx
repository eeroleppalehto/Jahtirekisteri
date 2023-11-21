import MemberDetails from "./MemberDetails";
import ShotDetails from "./ShotDetails";
import ErrorScreen from "../ErrorScreen";
import { RootStackScreenProps } from "../../NavigationTypes";

type Props = RootStackScreenProps<"Details">;

// Screen for displaying details screens for different types
// if type is not found, displays an error screen
function DetailsScreen({ route, navigation }: Props) {
    if (!route.params?.type) return <ErrorScreen />;
    try {
        // Get type from route params
        const { type } = route.params;

        // Switch case for selecting the correct details screen
        switch (type) {
            case "Jäsen":
                return <MemberDetails route={route} navigation={navigation} />;
            case "Kaato":
                return <ShotDetails route={route} navigation={navigation} />;
            default:
                return <ErrorScreen />;
        }
    } catch (error) {
        console.log("Screen type not found");
        if (error instanceof Error) console.log(error.message);
        return <ErrorScreen />;
    }
}

export default DetailsScreen;