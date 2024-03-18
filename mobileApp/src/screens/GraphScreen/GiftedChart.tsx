import { View, StyleSheet } from "react-native";
import { BarChart, yAxisSides } from "react-native-gifted-charts";
import { FlatList } from "react-native-gesture-handler";
import { MD3Theme, Text, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";

type ChartData = {
    kokonimi: string;
    count: number;
};

export function GiftedChart() {
    const result = useFetchQuery<ChartData[]>("graphs/deer-count", [
        "DeerChart",
    ]);

    const theme = useTheme();

    const barData = [
        { value: 250, label: "M" },
        { value: 500, label: "T", frontColor: theme.colors.primary },
        { value: 745, label: "W", frontColor: theme.colors.primary },
        { value: 320, label: "T" },
        { value: 600, label: "F", frontColor: theme.colors.primary },
        { value: 256, label: "S" },
        { value: 300, label: "S" },
    ];

    const mapBarData = () => {
        if (result.isSuccess) {
            return result.data.map((item, index) => {
                return {
                    value: item.count,
                    label: `${(index + 1).toString()}.`,
                    name: item.kokonimi,
                    topLabelComponent: () => <Text>{item.count}</Text>,
                    frontColor: theme.colors.primary,
                };
            });
        }
    };

    barData.sort((a, b) => b.value - a.value);

    return (
        <>
            {result.isError && <ErrorScreen error={result.error} />}
            {result.isSuccess && (
                <>
                    <View
                        style={{
                            // height: 400,
                            padding: 16,
                            marginTop: 16,
                            marginHorizontal: 16,
                            backgroundColor: theme.colors.surface,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.surfaceVariant,
                        }}
                    >
                        <BarChart
                            // horizontal
                            // barWidth={22}
                            noOfSections={5}
                            // yAxisSide={yAxisSides.RIGHT}
                            yAxisAtTop={true}
                            barBorderRadius={4}
                            frontColor="lightgray"
                            data={mapBarData()}
                            // width={250}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            // height={500}
                            // renderTooltip={(item: { name: string }) => (
                            //     <View
                            //         style={{
                            //             position: "relative",
                            //             right: 30,
                            //             bottom: 30,
                            //         }}
                            //     >
                            //         <Text style={{ transform: [{ rotate: "-90deg" }] }}>
                            //             {item.name}
                            //         </Text>
                            //     </View>
                            // )}
                        />
                    </View>
                    <FlatList
                        data={result.data}
                        style={{ marginHorizontal: 16, marginTop: 16 }}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 4 }} />
                        )}
                        ListHeaderComponent={<TableHeader theme={theme} />}
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
                            />
                        )}
                    />
                    {/* <ScrollView>
                        <View>
                            {result.data.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            marginHorizontal: 16,
                                            marginTop: 8,
                                        }}
                                    >
                                        <Text>{`${index + 1}.`}</Text>
                                        <Text>{item.kokonimi}</Text>
                                        <Text>{item.count}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView> */}
                </>
            )}
        </>
    );
}

type RowProps = {
    item: ChartData;
    index: number;
    theme: MD3Theme;
    len: number;
};

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
            }}
        >
            <View>
                <Text
                    variant="titleMedium"
                    style={{
                        textAlign: "center",
                        paddingVertical: 8,
                        color: theme.colors.primary,
                    }}
                >
                    Metsästäjien Peurakaadot
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
                        flex: 1,
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
                        #
                    </Text>
                </View>
                <View
                    style={{
                        flex: 12,
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
                        Nimi
                    </Text>
                </View>
                <View
                    style={{
                        // flex: 1,
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
                        Lkm
                    </Text>
                </View>
            </View>
        </View>
    );
}

function TableRow({ item, index, theme, len }: RowProps) {
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
            <View
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
            </View>
            <View
                style={{
                    flex: 12,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Text variant="bodyMedium">{item.kokonimi}</Text>
            </View>
            <View
                style={{
                    // flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                }}
            >
                <Text variant="labelLarge">{item.count}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderEndEndRadius: 4,
    },
});

{
    /* <Canvas style={{ flex: 1 }}>
                            <SkText text={item.name} font={font} x={0} y={16} />
                        </Canvas> */
}
