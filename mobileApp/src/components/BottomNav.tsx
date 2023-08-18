import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Text } from 'react-native-paper';

import MemberScreen from '../screens/MemberScreen';
import MaintenanceNav from './MaintenanceNav';

const Tab = createMaterialBottomTabNavigator();

const Placeholder = () => {
    return <Text>Placeholder</Text>;
};

// TODO: Fix Props type
interface Props {
    navigation: any;
}

function BottomNav({ navigation }: Props) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Grafiikka" component={Placeholder} />
            <Tab.Screen name="Kaadot" component={Placeholder} />
            <Tab.Screen name="Ylläpito" component={MaintenanceNav} />
        </Tab.Navigator>
    );
}

export default BottomNav;