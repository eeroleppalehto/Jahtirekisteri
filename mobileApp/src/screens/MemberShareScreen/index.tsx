import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ShareTabScreenProps } from "../../NavigationTypes";
import { ShareViewQuery } from "../../types";
import MemberShareListItem from "./MembershareListItem";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";

type Props = ShareTabScreenProps<"Jäsenille">;

//Screen for displaying shares meant for groups
function MemberShareScreen({ navigation, route }: Props) {
    const result = useFetchQuery<ShareViewQuery[]>(
        "views/?name=mobiili_ryhmien_jaot&column=kaadon_kasittely.kasittelyid&value=5",
        ["MemberShares"]
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
                        <MemberShareListItem share={item} />
                    )}
                />
            )}
        </>
    );
}

export default MemberShareScreen;
