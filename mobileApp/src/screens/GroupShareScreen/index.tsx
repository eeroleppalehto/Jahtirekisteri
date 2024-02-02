import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ShareTabScreenProps } from "../../NavigationTypes";
import { ShareViewQuery } from "../../types";
import GroupShareListItem from "./GroupShareListItem";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";

type Props = ShareTabScreenProps<"Ryhmille">;

//Screen for displaying shares meant for groups
function GroupShareScreen({ navigation, route }: Props) {
    const result = useFetchQuery<ShareViewQuery[]>(
        "views/?name=mobiili_ryhmien_jaot&column=kaadon_kasittely.kasittelyid&value=2",
        ["GroupShares"]
    );

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess && (
                <FlatList
                    data={result.data}
                    keyExtractor={(item) => item.kaadon_kasittely_id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={result.isLoading}
                            onRefresh={result.refetch}
                        />
                    }
                    renderItem={({ item }) => (
                        <GroupShareListItem
                            navigation={navigation}
                            share={item}
                        />
                    )}
                />
            )}
        </>
    );
}

export default GroupShareScreen;
