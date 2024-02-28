import MemberForm from "./MemberForm";
import ShotForm from "./ShotForm";
import { GroupForm } from "./GroupForm";
import { PartyForm } from "./PartyForm";
import { RootStackScreenProps } from "../../NavigationTypes";
import { ErrorScreen } from "../ErrorScreen";

type Props = RootStackScreenProps<"Forms">;

// Screen for displaying the correct form based on the type parameter
export default function FormScreen({ route, navigation }: Props) {
    // If type parameter is undefined, display error screen
    if (!route.params?.type)
        return <ErrorScreen error={new Error("Virhe siirtyessä sivulle")} />;

    const { type } = route.params;

    // Switch case for selecting the correct form
    switch (type) {
        case "Member":
            return <MemberForm route={route} navigation={navigation} />;
        case "Shot":
            return <ShotForm route={route} navigation={navigation} />;
        case "Group":
            return <GroupForm route={route} navigation={navigation} />;
        case "Party":
            return <PartyForm route={route} navigation={navigation} />;
        default:
            return (
                <ErrorScreen error={new Error("Virhe siirtyessä sivulle")} />
            );
    }
}
