import MemberForm from "./MemberForm";
import ShotForm from "./ShotForm";
import { RootStackScreenProps } from "../../NavigationTypes";
import ErrorScreen from "../ErrorScreen";

type Props = RootStackScreenProps<"Forms">;

// Screen for displaying the correct form based on the type parameter
export default function FormScreen({ route, navigation }: Props) {
    // If type parameter is undefined, display error screen
    if (!route.params?.type) return <ErrorScreen />;

    const { type } = route.params;

    // Switch case for selecting the correct form
    switch (type) {
        case "jäsen":
            return <MemberForm />;
        case "kaato":
            return <ShotForm route={route} navigation={navigation} />;
        default:
            return <ErrorScreen />;
    }
}
