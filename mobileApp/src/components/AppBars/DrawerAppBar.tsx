import { Appbar } from "react-native-paper";
import { DrawerHeaderProps } from "@react-navigation/drawer";

type Props = DrawerHeaderProps;

// The AppBar component that is rendered in the ProfileScreen
export default function DrawerAppBar({
    navigation,
    route,
    layout,
    options,
}: Props) {
    const { title } = options;

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title={title ? title : ""} />
        </Appbar.Header>
    );
}
