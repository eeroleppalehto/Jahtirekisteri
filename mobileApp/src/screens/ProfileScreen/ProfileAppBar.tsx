import { Appbar } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface Props {
    navigation: DrawerNavigationProp<any, any>;
}

export default function ProfileAppBar({ navigation }: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Profiili" />
        </Appbar.Header>
    );
}