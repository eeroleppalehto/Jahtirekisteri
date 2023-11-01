//import { ActivityIndicator } from "react-native";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { MD3Colors, Text, ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import useFetch from "../../../hooks/useFetch";
import { BottomTabScreenProps } from "../../NavigationTypes";
import { Kaato } from "../../types";
import FloatingActionButton from "../../components/FloatingActionButton";
import ShotListItem from "./ShotListItem";

type Props = BottomTabScreenProps<"Kaadot">;

function ShotScreen({ navigation, route }: Props) {
    const [scrollValue, setScrollValue] = useState(0);

    const onScroll = ({
        nativeEvent,
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setScrollValue(currentScrollPosition);
    };

    const onSwipeDown = () => {
        console.log("swipe");
    };

    const results = useFetch<Kaato[]>("shots", "GET", null);

    if (results.error) {
        return <Text>{results.error.message}</Text>;
    }

    return (
        <>
            {results.loading ? (
                <ActivityIndicator size={"large"} style={{ paddingTop: 50 }} />
            ) : (
                <>
                    <FlatList
                        data={results.data}
                        keyExtractor={(item) => item.kaato_id.toString()}
                        renderItem={({ item }) => (
                            <ShotListItem shot={item} navigation={navigation} />
                        )}
                        onScroll={onScroll}
                        // onGestureEvent={console.log("gesture")}
                    />
                    <FloatingActionButton
                        scrollValue={scrollValue}
                        type="kaato"
                        label="Lisää kaato  "
                    />
                </>
            )}
        </>
    );
}

export default ShotScreen;
