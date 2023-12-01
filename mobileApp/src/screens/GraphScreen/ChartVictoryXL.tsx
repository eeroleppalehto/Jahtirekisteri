import { View } from "react-native";
import useFetch from "../../../hooks/useFetch";
type GroupDataChart = {
    ryhma_id: number;
    ryhman_nimi: string;
    seurue_id: number;
    osuus: number | null;
    maara: number | null;
};

const ChartVictoryXL = () => {
    const { data, loading, error } = useFetch<GroupDataChart[]>(
        `views/?name=jakoryhma_osuus_maara`
    );
    const font = useFont(
        require("../../fonts/Roboto-Regular.ttf"),
        12,
        (err) => {
            console.log(err.message);
        }
    );

    const parsedData = data
        ? data.map((item) => {
              const maara = item.maara === null ? 0 : item.maara;
              return {
                  group: item.ryhman_nimi,
                  maara: maara,
              };
          })
        : [];

    return (
        <ScrollView>
            <View style={{ height: 400, margin: 16 }}>
                {loading ? (
                    <ActivityIndicator animating={true} />
                ) : (
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
                axisOptions={{
                    font,
                            formatXLabel(_value) {
                                return "";
                    },
                }}
            >
                {({ points, chartBounds }) => (
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
                        )}
            </CartesianChart>
                )}
        </View>
        </ScrollView>
    );
};

export default ChartVictoryXL;
