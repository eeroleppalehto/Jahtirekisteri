import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack/lib/typescript/src/types";

type Props = NativeStackHeaderProps;

// The AppBar component that is rendered in the ProfileScreen
export default function LoginAppBar({
    navigation,
    route,
    options,
    back,
}: Props) {
    return (
        <Appbar.Header>
            {/* <Appbar.BackAction onPress={() => navigation.goBack()} /> */}
            <Appbar.Content title="Kirjaudu sisään" />
        </Appbar.Header>
    );
}
