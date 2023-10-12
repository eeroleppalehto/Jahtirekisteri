import { VictoryChart, VictoryGroup, VictoryBar } from "victory-native";

export default function VictoryGroupChart() {
    return (
        <VictoryChart>
            <VictoryGroup
                offset={30}
                colorScale={"qualitative"}
                // horizontal={true}
            >
                <VictoryBar
                    data={[
                        { x: "Ryhmä1", y: 1 },
                        { x: "Ryhmä2", y: 2 },
                        { x: "Ryhmä3", y: 5 },
                    ]}
                />
                <VictoryBar
                    data={[
                        { x: "Ryhmä1", y: 2 },
                        { x: "Ryhmä2", y: 1 },
                        { x: "Ryhmä3", y: 7 },
                    ]}
                />
                {/* <VictoryBar
                    data={[
                        { x: "Ryhmä1", y: 3 },
                        { x: "Ryhmä2", y: 4 },
                        { x: "Ryhmä3", y: 9 },
                    ]}
                /> */}
            </VictoryGroup>
        </VictoryChart>
    );
}
