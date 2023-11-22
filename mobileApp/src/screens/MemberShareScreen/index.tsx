import useFetch from "../../../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { ShareTabScreenProps } from "../../NavigationTypes";
import { ShareViewQuery } from "../../types";
import MemberShareListItem from "./MembershareListItem";

type Props = ShareTabScreenProps<"Jäsenille">;

//Screen for displaying shares meant for groups
function MemberShareScreen({ navigation, route }: Props) {
    const { data, loading, error } = useFetch<ShareViewQuery[]>(
        "view/?viewName=mobiili_ryhmien_jaot&column=kaadon_kasittely.kasittelyid&value=5"
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
                        <MemberShareListItem share={item} />
                    )}
                />
            )}
        </>
    );
}

export default MemberShareScreen;
