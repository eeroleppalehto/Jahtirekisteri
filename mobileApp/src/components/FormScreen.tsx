import MemberForm from "../screens/Forms/MemberForm";
import { Text } from "react-native-paper";
import { RootStackScreenProps } from "../NavigationTypes";

const ErrorScreen = () => {
    return <Text>Virhe!</Text>;
};

type Props = RootStackScreenProps<"Forms">;

export default function FormScreen({ route }: Props) {
    if (!route.params?.type) return <ErrorScreen />;

    const { type } = route.params;

    switch (type) {
        case "jäsen":
            return <MemberForm />;
        default:
            return <ErrorScreen />;
    }
}
