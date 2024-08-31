import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

type Props = NativeStackHeaderProps;

// The AppBar component that is rendered in the DetailsScreen
export default function DetailsAppBar({
    back,
    navigation,
    route,
    options,
}: Props) {
    // Get the title of the app bar from the route parameters
    const { title } = route.params as { title: string };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}
