import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import { GraphTabParamList } from "../NavigationTypes";
import { DeerShotsGraph } from "../screens/GraphScreen/DeerShotsChart";
import { MooseShareChart } from "../screens/GraphScreen/MooseShareChart";
import ChartVictoryXL from "../screens/GraphScreen/ChartVictoryXL";

const TopTab = createMaterialTopTabNavigator<GraphTabParamList>();

/**
 * Top navigation for the graph screens. This component is used to
 * navigate between the DeerShotsChart and the MooseShareChart.
 * @date 2024-03-18 - 11:04
 *
 */

function GraphNav() {
    const theme = useTheme();
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primary,
                },
            }}
        >
            <TopTab.Screen name="Peura" component={DeerShotsGraph} />
            <TopTab.Screen name="Hirvi" component={MooseShareChart} />
        </TopTab.Navigator>
    );
}

export default GraphNav;
