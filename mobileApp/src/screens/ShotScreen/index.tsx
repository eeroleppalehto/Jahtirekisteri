import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { BottomTabScreenProps } from "../../NavigationTypes";
import { ShotViewQuery } from "../../types";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import ShotListItem from "./ShotListItem";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";

type Props = BottomTabScreenProps<"Kaadot">;

// Screen for displaying all shots in Shots tab
function ShotScreen({ navigation, route }: Props) {
    const [scrollValue, setScrollValue] = useState(0);

    // Callback function for updating scroll value and passing it to FloatingNavigationButton
    // which uses it to determine when to extend the button
    const onScroll = ({
        nativeEvent,
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setScrollValue(currentScrollPosition);
    };

    const result = useFetchQuery<ShotViewQuery[]>(
        "views/?name=mobiili_kaato_sivu",
        ["Shots"]
    );

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess && (
                <>
                    <FlatList
                        data={result.data}
                        keyExtractor={(item) => item.kaato_id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={result.isLoading}
                                onRefresh={result.refetch}
                            />
                        }
                        renderItem={({ item }) => (
                            <ShotListItem shot={item} navigation={navigation} />
                        )}
                        onScroll={onScroll}
                        // onGestureEvent={console.log("gesture")}
                    />
                    <FloatingNavigationButton
                        scrollValue={scrollValue}
                        type="Shot"
                        label="Lisää kaato"
                        onPress={() =>
                            navigation.navigate("Forms", {
                                type: "Shot",
                                clear: false,
                                shot: {
                                    jasen_id: undefined,
                                    kaatopaiva: undefined,
                                    ruhopaino: 0,
                                    paikka_teksti: "",
                                    elaimen_nimi: undefined,
                                    sukupuoli: undefined,
                                    ikaluokka: undefined,
                                    lisatieto: "",
                                },
                                usage: [
                                    {
                                        kasittelyid: undefined,
                                        kasittely_maara: 100,
                                    },
                                    {
                                        kasittelyid: undefined,
                                        kasittely_maara: 0,
                                    },
                                ],
                            })
                        }
                    />
                </>
            )}
        </>
    );
}

export default ShotScreen;
