import { View } from "react-native";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { GroupViewQuery } from "../../types";
import useFetch from "../../../hooks/useFetch";
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
                groups: [group],
            });
        } else {
            acc.find((item) => item.party === group.seurue_id)?.groups.push(
                group
            );
        }
        return acc;
    }, [] as { party: number; groups: GroupViewQuery[] }[]);

    // Create a group list for each party
    const partyContent = groupsByParty?.map((item) => {
        return (
            <View key={item.party}>
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    {item.groups[0].seurueen_nimi}
                </Text>
                {item.groups.map((group) => (
                    <GroupListItem
                        key={group.ryhma_id}
                        group={group}
                        navigation={navigation}
                    />
                ))}
            </View>
        );
    });

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
        >
            <>{partyContent}</>
        </ScrollView>
    );
}

export default GroupScreen;
