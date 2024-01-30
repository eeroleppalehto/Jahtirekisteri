import { View } from "react-native";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { Text, Surface, useTheme } from "react-native-paper";
import { Bar, CartesianChart, useChartPressState } from "victory-native";
import {
    LinearGradient,
    useFont,
    vec,
    Text as SkText,
} from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";

type GroupDataChart = {
    ryhma_id: number;
    ryhman_nimi: string;
    seurue_id: number;
    osuus: number | null;
    maara: number | null;
};

const ChartVictoryXL = () => {
    const result = useFetchQuery<GroupDataChart[]>(
        `views/?name=jakoryhma_osuus_maara`,
        "GroupChartData"
    );

    const initialYState: Record<"maara", number> = {
        maara: 0,
    };

    const { state, isActive } = useChartPressState({
        x: "0",
        y: initialYState,
    });

    const font = useFont(
        require("../../fonts/Roboto-Regular.ttf"),
        12,
        (err) => {
            console.log(err.message);
        }
    );

    const theme = useTheme();

    const parsedData = result.data
        ? result.data.map((item) => {
              const maara = item.maara === null ? 0 : item.maara;
              return {
                  group: item.ryhman_nimi,
                  maara: maara,
              };
          })
        : [];

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess && (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={result.isLoading}
                            onRefresh={result.refetch}
                        />
                    }
                >
                    <View style={{ height: 400, margin: 16 }}>
                        <CartesianChart
                            data={parsedData}
                            xKey="group"
                            yKeys={["maara"]}
                            domainPadding={{
                                left: 60,
                                right: 60,
                                top: 60,
                                bottom: 400,
                            }}
                            chartPressState={state}
                            axisOptions={{
                                font,
                                formatXLabel(_value) {
                                    return "";
                                },
                            }}
                        >
                            {({ points, chartBounds }) => (
                                <>
                                    <Bar
                                        key={"group"}
                                        chartBounds={chartBounds}
                                        points={points.maara}
                                        innerPadding={0.5}
                                        roundedCorners={{
                                            topLeft: 5,
                                            topRight: 5,
                                        }}
                                    >
                                        <LinearGradient
                                            start={vec(0, 0)}
                                            end={vec(0, 400)}
                                            colors={["#526600", "#52660050"]}
                                        />
                                    </Bar>
                                    {isActive && (
                                        <ToolTip
                                            x={state.x.position}
                                            y={state.y.maara.position}
                                            title={{
                                                nimi: state.x.value.value,
                                                maara: state.y.maara.value
                                                    .value,
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </CartesianChart>
                    </View>
                    <Surface
                        elevation={1}
                        style={{
                            marginHorizontal: 16,
                            marginVertical: 30,
                            borderRadius: 8,
                            padding: 8,
                            paddingBottom: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: 8,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text
                                    variant="titleMedium"
                                    style={{
                                        color: theme.colors.primary,
                                        marginBottom: 12,
                                    }}
                                >
                                    Ryhmien lihat
                                </Text>
                                <Text
                                    variant="titleSmall"
                                    style={{
                                        color: theme.colors.outline,
                                        marginBottom: 12,
                                        marginRight: 16,
                                    }}
                                >
                                    {"(kg)"}
                                </Text>
                            </View>

                            {parsedData.map((item) => (
                                <View
                                    key={item.group}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginHorizontal: 16,
                                    }}
                                >
                                    <Text variant="bodyMedium">
                                        {item.group}
                                    </Text>
                                    <Text variant="bodyMedium">
                                        {item.maara}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Surface>
                </ScrollView>
            )}
        </>
    );
};

function ToolTip({
    x,
    y,
    title,
}: {
    x: SharedValue<number>;
    y: SharedValue<number>;
    title: { nimi: string; maara: number };
}) {
    const theme = useTheme();

    const nameLength = title.nimi.length * 4;
    const amountLength = title.maara.toString().length * 4;

    const font = useFont(
        require("../../fonts/Roboto-Regular.ttf"),
        16,
        (err) => {
            console.log(err.message);
        }
    );

    return (
        <>
            <SkText
                text={title.nimi}
                x={x.value - nameLength}
                y={16}
                font={font}
            />
            <SkText
                text={title.maara.toString() + " kg"}
                x={x.value - amountLength}
                y={32}
                font={font}
            />
        </>
    );
}

export default ChartVictoryXL;
