import useFetch from "../../../hooks/useFetch";
import { PartyViewQuery } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import PartyListItem from "./PartyListItem";
import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";

type Props = MaintenanceTabScreenProps<"Seurueet">;

function PartyScreen({ navigation, route }: Props) {
    const { data, loading, error, onRefresh } = useFetch<PartyViewQuery[]>(
        `views/?name=mobiili_seurue_sivu`
    );

    const theme = useTheme();

    // Group parties by type
    const partyByType = data?.reduce((acc, party) => {
        // If the party type is not yet in the accumulator, add it
        // Otherwise, add the party to the parties array of the type
        if (!acc.some((item) => item.type === party.seurue_tyyppi_id)) {
            acc.push({
                type: party.seurue_tyyppi_id,
                parties: [party],
            });
        } else {
            acc.find(
                (item) => item.type === party.seurue_tyyppi_id
            )?.parties.push(party);
        }
        return acc;
    }, [] as { type: number; parties: PartyViewQuery[] }[]);

    // Create a list of PartyListItems for each party type
    const partyContent = partyByType?.map((item) => {
        return (
            <View key={item.type} style={{ marginBottom: 20 }}>
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    {item.parties[0].seurue_tyyppi_nimi} Seurueet
                </Text>
                {item.parties.map((party) => (
                    <PartyListItem key={party.seurue_id} party={party} />
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

export default PartyScreen;
