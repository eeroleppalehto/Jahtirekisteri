import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, Text } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ShotViewQuery } from "../../types";
import { ErrorScreen } from "../ErrorScreen";

export default function ProfileScreen() {
    const result = useFetchQuery<ShotViewQuery[]>(
        "views/?name=mobiili_kaato_sivu",
        ["Shots"]
    );

    // return (
    //     <View
    //         style={{
    //             flex: 1,
    //             justifyContent: "center",
    //             alignItems: "center",
    //             gap: 10,
    //         }}
    //     >
    //         <Text>Profile</Text>
    //     </View>
    // );

    return (
        <>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess ? (
                <FlatList
                    data={result.data}
                    keyExtractor={(item) => item.kaato_id.toString()}
                    renderItem={({ item }) => <Text>{item.kaato_id}</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={result.isLoading}
                            onRefresh={result.refetch}
                        />
                    }
                />
            ) : null}
        </>
    );
}
