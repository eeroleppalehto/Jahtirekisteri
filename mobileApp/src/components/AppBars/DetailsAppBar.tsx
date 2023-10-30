import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

type Props = NativeStackHeaderProps;

export default function DetailsAppBar({
    back,
    navigation,
    route,
    options,
}: Props) {
    const { title } = route.params as { title: string };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}
