import { View, StyleSheet } from "react-native";
import { BarChart, yAxisSides } from "react-native-gifted-charts";
import { FlatList } from "react-native-gesture-handler";
import { MD3Theme, Surface, Text, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";

type ChartData = {
    kokonimi: string;
    count: number;
};

export function DeerShotsGraph() {
    const result = useFetchQuery<ChartData[]>("graphs/deer-count", [
        "DeerChart",
    ]);

    const theme = useTheme();

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

    return (
        <>
            {result.isError && <ErrorScreen error={result.error} />}
            {result.isSuccess && (
                <>
                    <Surface
                        elevation={2}
                        style={{
                            // height: 400,
                            padding: 12,
                            marginVertical: 12,
                            marginHorizontal: 16,
                            backgroundColor: theme.colors.background,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.surfaceVariant,
                        }}
                    >
                        <BarChart
                            noOfSections={5}
                            yAxisAtTop={true}
                            barBorderRadius={4}
                            frontColor="lightgray"
                            data={mapBarData()}
                            yAxisThickness={0}
                            xAxisThickness={0}
                        />
                    </Surface>
                    <TableHeader theme={theme} />
                    <FlatList
                        data={result.data}
                        style={{ marginHorizontal: 16 }}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 4 }} />
                        )}
                        // ListHeaderComponent={<TableHeader theme={theme} />}
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
                marginHorizontal: 16,
                paddingTop: 16,
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
