import { View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
// import inter from "../fonts/inter-medium.ttf"

const ChartVictoryXL = () => {
    //const font = useFont(inter, 12)
    const data = Array.from({ length: 6 }, (_, index) => ({
        month: index + 1,
        listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    }));

    return (
        <CartesianChart
            data={data}
            xKey="month"
            yKeys={["listenCount"]}
            domainPadding={{ left: 50, right: 50, top: 30 }}
            axisOptions={{
                formatXLabel(value) {
                    const date = new Date(2023, value - 1);
                    return date.toLocaleString("default", {
                        month: "short",
                    });
                },
            }}
        >
            {({ points, chartBounds }) => (
                <Bar
                    chartBounds={chartBounds}
                    points={points.listenCount}
                    roundedCorners={{
                        topLeft: 5,
                        topRight: 5,
                    }}
                >
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 400)}
                        colors={["#a78bfa", "#a78bfa50"]}
                    />
                </Bar>
            )}
        </CartesianChart>
    );
};

export default ChartVictoryXL;
