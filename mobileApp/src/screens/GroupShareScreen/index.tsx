import useFetch from "../../../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { ShareTabScreenProps } from "../../NavigationTypes";
import { ShareViewQuery } from "../../types";
import GroupShareListItem from "./GroupShareListItem";

type Props = ShareTabScreenProps<"Ryhmille">;

//Screen for displaying shares meant for groups
function GroupShareScreen({ navigation, route }: Props) {
    const { data, loading, error } = useFetch<ShareViewQuery[]>(
        "view/?viewName=mobiili_ryhmien_jaot&column=kaadon_kasittely.kasittelyid&value=2"
    );

    return (
        <>
            {loading ? (
                <ActivityIndicator size={"large"} style={{ paddingTop: 50 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.kaadon_kasittely_id.toString()}
                    renderItem={({ item }) => (
                        <GroupShareListItem share={item} />
                    )}
                />
            )}
        </>
    );
}

export default GroupShareScreen;
