import MemberDetails from "./MemberDetails";
import ShotDetails from "./ShotDetails";
import GroupDetails from "./GroupDetails";
import { PartyDetails } from "./PartyDetails";
import { ErrorScreen } from "../ErrorScreen";
import { MemberShareDetails } from "./MemberShareDetails";
import { GroupShareDetails } from "./GroupShareDetails";
import { RootStackScreenProps } from "../../NavigationTypes";

type Props = RootStackScreenProps<"Details">;

// Screen for displaying details screens for different types
// if type is not found, displays an error screen
function DetailsScreen({ route, navigation }: Props) {
    if (!route.params?.type)
        return (
            <ErrorScreen error={new Error("Tapahtui virhe navigaatiossa")} />
        );
    try {
        // Get type from route params
        const { type } = route.params;

        // Switch case for selecting the correct details screen
        switch (type) {
            case "Member":
                return <MemberDetails route={route} navigation={navigation} />;
            case "Shot":
                return <ShotDetails route={route} navigation={navigation} />;
            case "Group":
                return <GroupDetails route={route} navigation={navigation} />;
            case "Party":
                return <PartyDetails route={route} navigation={navigation} />;
            case "MemberShare":
                return (
                    <MemberShareDetails route={route} navigation={navigation} />
                );
            case "GroupShare":
                return (
                    <GroupShareDetails route={route} navigation={navigation} />
                );
            default:
                return (
                    <ErrorScreen
                        error={new Error("Tapahtui virhe navigaatiossa")}
                    />
                );
        }
    } catch (error) {
        console.log("Screen type not found");
        if (error instanceof Error) console.log(error.message);
        return (
            <ErrorScreen error={new Error("Tapahtui virhe navigaatiossa")} />
        );
    }
}

export default DetailsScreen;
