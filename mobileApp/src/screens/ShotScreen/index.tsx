import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { Text } from "react-native-paper";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import useFetch from "../../hooks/useFetch";
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

    // Fetch all shots from the API
    const { data, loading, error, onRefresh } = useFetch<ShotViewQuery[]>(
        "views/?name=mobiili_kaato_sivu"
    );

    if (error) {
        return <Text>{error.message}</Text>;
    }

    // If loading, display loading indicator
    // Else display the list of shots
    // TODO: Add error handling
    return (
        <>
            <FlatList
                data={data}
                keyExtractor={(item) => item.kaato_id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
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
                type="kaato"
                label="Lisää kaato  "
            />
        </>
    );
}

export default ShotScreen;
