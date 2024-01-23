import useFetch from "../../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ShareTabScreenProps } from "../../NavigationTypes";
import { ShareViewQuery } from "../../types";
import GroupShareListItem from "./GroupShareListItem";

type Props = ShareTabScreenProps<"Ryhmille">;

//Screen for displaying shares meant for groups
function GroupShareScreen({ navigation, route }: Props) {
    const { data, loading, error, onRefresh } = useFetch<ShareViewQuery[]>(
        "views/?name=mobiili_ryhmien_jaot&column=kaadon_kasittely.kasittelyid&value=2"
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.kaadon_kasittely_id.toString()}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => <GroupShareListItem share={item} />}
        />
    );
}

export default GroupShareScreen;
