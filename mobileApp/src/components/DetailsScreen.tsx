import MemberDetails from "../screens/MemberScreen/MemberDetails";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
    route: any;
}

const ErrorScreen = () => {
    return (
        <View>
            <Text>Virhe!</Text>
        </View>
    );
};

function DetailsScreen({ route }: Props) {
    if (!(route.params.type)) return <ErrorScreen />;
    
    switch (route.params.type) {
        case 'Jäsen':
            return <MemberDetails route={route} />;
        default:
            return <ErrorScreen />;
    }
}

export default DetailsScreen;