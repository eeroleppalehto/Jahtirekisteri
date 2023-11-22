import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import useFetch from "../../../hooks/useFetch";
import { BottomTabScreenProps } from "../../NavigationTypes";
import { ShotViewQuery } from "../../types";
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
    const { data, loading, error } = useFetch<ShotViewQuery[]>(
        "view/?viewName=mobiili_kaato_sivu"
    );

    if (error) {
        return <Text>{error.message}</Text>;
    }

    // If loading, display loading indicator
    // Else display the list of shots
    // TODO: Add error handling
    return (
        <>
            {loading ? (
                <ActivityIndicator size={"large"} style={{ paddingTop: 50 }} />
            ) : (
                <>
                    <FlatList
                        data={data}
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
