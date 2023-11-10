//import { ActivityIndicator } from "react-native";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { MD3Colors, Text, ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import useFetch from "../../../hooks/useFetch";
import { BottomTabScreenProps } from "../../NavigationTypes";
import { Shot } from "../../types";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import ShotListItem from "./ShotListItem";

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

    const onSwipeDown = () => {
        console.log("swipe");
    };

    // Fetch all shots from the API
    const results = useFetch<Shot[]>("shots");

    if (results.error) {
        return <Text>{results.error.message}</Text>;
    }

    // If loading, display loading indicator
    // Else display the list of shots
    // TODO: Add error handling
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
                    <FloatingNavigationButton
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
