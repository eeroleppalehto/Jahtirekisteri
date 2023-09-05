import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

type Props = NativeStackHeaderProps;

export default function FormAppBar({
    back,
    navigation,
    route,
    options,
}: Props) {
    const { type } = route.params as { type: string };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää ${type}`} />
        </Appbar.Header>
    );
}
