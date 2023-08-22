import { Appbar } from "react-native-paper";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerNavParamList } from "../../components/DrawerNav";
import { DrawerHeaderProps } from "@react-navigation/drawer";

type Props = DrawerHeaderProps;

export default function ProfileAppBar({
    navigation,
    route,
    layout,
    options,
}: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Profiili" />
        </Appbar.Header>
    );
}
