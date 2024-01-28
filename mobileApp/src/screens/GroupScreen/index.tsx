import { SectionList } from "react-native";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { Text, useTheme } from "react-native-paper";
import { RefreshControl } from "react-native-gesture-handler";
import { GroupViewQuery } from "../../types";
import useFetch from "../../hooks/useFetch";
import GroupListItem from "./GroupListItem";

type Props = MaintenanceTabScreenProps<"Ryhmät">;

// Screen for displaying all groups in Groups tab
function GroupScreen({ navigation, route }: Props) {
    const { data, loading, error, onRefresh } = useFetch<GroupViewQuery[]>(
        "views/?name=mobiili_ryhma_sivu"
    );

    const theme = useTheme();

    // Group the groups by party
    const groupsByParty = data?.reduce((acc, group) => {
        // If the party is not yet in the array, add it
        // Otherwise, add the group to the party's groups
        if (!acc.some((item) => item.party === group.seurue_id)) {
            acc.push({
                party: group.seurue_id,
                partyName: group.seurueen_nimi,
                data: [group],
            });
        } else {
            acc.find((item) => item.party === group.seurue_id)?.data.push(
                group
            );
        }
        return acc;
    }, [] as { party: number; partyName: string; data: GroupViewQuery[] }[]);

    return (
        <>
            {groupsByParty && (
                <SectionList
                    sections={groupsByParty}
                    keyExtractor={(item) => item.ryhma_id.toString()}
                    renderItem={({ item }) => (
                        <GroupListItem group={item} navigation={navigation} />
                    )}
                    renderSectionHeader={({ section: { partyName } }) => (
                        <Text
                            variant="titleMedium"
                            style={{
                                color: theme.colors.primary,
                                paddingLeft: 16,
                                paddingTop: 20,
                            }}
                        >
                            {partyName}
                        </Text>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </>
    );
}

export default GroupScreen;
