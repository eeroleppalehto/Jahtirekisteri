import { StyleSheet, View } from "react-native";
import {
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryAxis,
} from "victory-native";
import { useTheme } from "react-native-paper";

const data = [
    { quarter: "Ryhmä1", earnings: 13000 },
    { quarter: "Ryhmä1", earnings: 16500 },
    { quarter: "Ryhmä2", earnings: 16500 },
    { quarter: "Ryhmä3", earnings: 14250 },
    { quarter: "Ryhmä4", earnings: 19000 },
];

export default function VictoryTest() {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <VictoryChart
                width={350}
                horizontal={true}
                theme={VictoryTheme.material}
                domainPadding={20}
            >
                <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
                    cornerRadius={3}
                    style={{
                        data: {
                            fill: theme.colors.primary,
                            stroke: theme.colors.primary,
                            strokeWidth: 2,
                        },
                    }}
                />
            </VictoryChart>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff",
    },
});
