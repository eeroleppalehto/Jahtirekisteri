import { View, StyleSheet } from "react-native";
import { BarChart, yAxisSides } from "react-native-gifted-charts";
import { FlatList } from "react-native-gesture-handler";
import { MD3Theme, Surface, Text, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";

type ChartData = {
    ryhma_id: number;
    ryhman_nimi: string;
    seurue_id: number;
    osuus: number | null;
    maara: number | null;
};

export function MooseShareChart() {
    const result = useFetchQuery<ChartData[]>("graphs/group-shares", [
        "GroupShareChart",
    ]);

    const theme = useTheme();

    const amountSum = (data: ChartData[]) => {
        return data.reduce((acc, item) => {
            return acc + (item.maara === null ? 0 : item.maara);
        }, 0);
    };

    const shareMultiplierSum = (data: ChartData[]) => {
        return data.reduce((acc, item) => {
            return acc + (item.osuus === null ? 0 : item.osuus);
        }, 0);
    };

    const parseNumber = (data: number | null) => {
        return data === null ? 0 : data;
    };

    const getExpectedShareValue = (
        amount: number,
        sharePortion: number,
        shareSum: number
    ) => {
        return Math.round((amount * sharePortion) / shareSum);
    };

    const sumOfAmounts = result.isSuccess ? amountSum(result.data) : 0;

    const sumOfShares = result.isSuccess ? shareMultiplierSum(result.data) : 0;

    const graphData = (data: ChartData[]) => {
        // const sumOfAmounts = amountSum(data);

        // const sumOfShares = shareMultiplierSum(data);

        const graphData = [];

        for (let i = 0; i < data.length; i++) {
            graphData.push({
                value: parseNumber(data[i].maara),
                label: data[i].ryhman_nimi,
                spacing: 2,
                labelWidth: 60,
                topLabelComponent: () => <Text>{data[i].maara ?? ""}</Text>,
                frontColor: theme.colors.primary,
            });

            let expectedShareValue = getExpectedShareValue(
                sumOfAmounts,
                parseNumber(data[i].osuus),
                sumOfShares
            );

            // console.log("expectedShareValue", expectedShareValue);

            graphData.push({
                value: expectedShareValue,
                topLabelComponent: () => (
                    <Text>
                        {expectedShareValue === 0
                            ? ""
                            : expectedShareValue.toString()}
                    </Text>
                ),
                frontColor: theme.colors.outline,
            });
        }

        return graphData;
    };

    return (
        <>
            {result.isError && <ErrorScreen error={result.error} />}
            {result.isSuccess && (
                <>
                    <Surface
                        elevation={2}
                        style={{
                            padding: 12,
                            marginVertical: 12,
                            marginHorizontal: 16,
                            backgroundColor: theme.colors.background,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.surfaceVariant,
                            gap: 12,
                        }}
                    >
                        <BarChart
                            data={graphData(result.data)}
                            noOfSections={5}
                            barBorderRadius={4}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            // yAxisSide={yAxisSides.LEFT}
                            // yAxisLabel="Kg"
                            // xAxisLabel="Ryhmä"
                            // barSpacing={2}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Surface
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4,
                                        backgroundColor: theme.colors.primary,
                                    }}
                                >
                                    <Text>{""}</Text>
                                </Surface>
                                <Text>Jaettu määrä</Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Surface
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4,
                                        backgroundColor: theme.colors.outline,
                                    }}
                                >
                                    <Text>{""}</Text>
                                </Surface>
                                <Text>Odotusarvo</Text>
                            </View>
                        </View>
                    </Surface>
                    <TableHeader theme={theme} />
                    <FlatList
                        data={result.data}
                        style={{ marginHorizontal: 16 }}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 4 }} />
                        )}
                        ListFooterComponent={() => (
                            <View style={{ height: 32 }} />
                        )}
                        keyExtractor={(_item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TableRow
                                item={item}
                                index={index}
                                theme={theme}
                                len={result.data.length}
                                expectedShareValue={getExpectedShareValue(
                                    sumOfAmounts,
                                    parseNumber(item.osuus),
                                    sumOfShares
                                )}
                            />
                        )}
                    />
                </>
            )}
        </>
    );
}

function TableHeader({ theme }: { theme: MD3Theme }) {
    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: theme.colors.surfaceVariant,
                marginBottom: 4,
                marginHorizontal: 16,
                paddingTop: 16,
            }}
        >
            <View>
                <Text
                    variant="titleMedium"
                    style={{
                        textAlign: "center",
                        paddingTop: 2,
                        paddingBottom: 4,
                        color: theme.colors.primary,
                    }}
                >
                    Hirvien jaot
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    gap: 8,
                }}
            >
                <View
                    style={{
                        flex: 2,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                >
                    <Text
                        variant="labelLarge"
                        style={{
                            color: theme.colors.primary,
                            fontWeight: "bold",
                        }}
                    >
                        Ryhmän nimi
                    </Text>
                </View>
                <View
                    style={{
                        flex: 2,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                >
                    <Text
                        variant="labelLarge"
                        style={{
                            color: theme.colors.primary,
                            fontWeight: "bold",
                        }}
                    >
                        Jaettu (kg)
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    <Text
                        variant="labelLarge"
                        style={{
                            color: theme.colors.primary,
                            fontWeight: "bold",
                        }}
                    >
                        +/-
                    </Text>
                </View>
            </View>
        </View>
    );
}

type RowProps = {
    item: ChartData;
    index: number;
    theme: MD3Theme;
    len: number;
    expectedShareValue: number;
};

function TableRow({ item, index, theme, len, expectedShareValue }: RowProps) {
    const diffrence = item.maara
        ? item.maara - expectedShareValue
        : -expectedShareValue;

    const diffrenceColor =
        diffrence >= 0 ? theme.colors.primary : theme.colors.error;

    const diffrenceText = diffrence >= 0 ? `+${diffrence}` : diffrence;

    const style =
        index === len - 1
            ? {
                  borderBottomWidth: 1,
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
              }
            : {};
    return (
        <View
            style={{
                ...style,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8,
                backgroundColor: theme.colors.surface,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: theme.colors.surfaceVariant,
            }}
        >
            {/* <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Text
                    variant="labelLarge"
                    style={{ color: theme.colors.secondary }}
                >{`${index + 1}.`}</Text>
            </View> */}
            <View
                style={{
                    flex: 2,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Text variant="bodyMedium">{item.ryhman_nimi}</Text>
            </View>
            <View
                style={{
                    flex: 2,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Text variant="bodyMedium">{item.maara ? item.maara : 0}</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                }}
            >
                <Text variant="labelLarge" style={{ color: diffrenceColor }}>
                    {diffrenceText}
                </Text>
            </View>
        </View>
    );
}
