import MemberForm from "./MemberForm";
import ShotForm from "./ShotForm";
import { Text } from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";

const ErrorScreen = () => {
    return <Text>Virhe!</Text>;
};

type Props = RootStackScreenProps<"Forms">;

export default function FormScreen({ route, navigation }: Props) {
    if (!route.params?.type) return <ErrorScreen />;

    const { type } = route.params;

    switch (type) {
        case "jäsen":
            return <MemberForm />;
        case "kaato":
            return <ShotForm route={route} navigation={navigation} />;
        default:
            return <ErrorScreen />;
    }
}
