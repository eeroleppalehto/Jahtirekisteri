import useFetch from "../../hooks/useFetch";
import { PartyViewQuery } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { RefreshControl } from "react-native-gesture-handler";
import PartyListItem from "./PartyListItem";
import { Text, useTheme } from "react-native-paper";
import { SectionList } from "react-native";

type Props = MaintenanceTabScreenProps<"Seurueet">;

function PartyScreen({ navigation, route }: Props) {
    const { data, loading, error, onRefresh } = useFetch<PartyViewQuery[]>(
        `views/?name=mobiili_seurue_sivu`
    );

    const theme = useTheme();

    // Generate sections for SectionList
    const partiesByType = data?.reduce((acc, party) => {
        // If type is not yet in array, add it
        if (!acc.some((item) => item.type === party.seurue_tyyppi_nimi)) {
            acc.push({
                type: party.seurue_tyyppi_nimi, // Type of party
                data: [party], // Array of parties
            });
        } else {
            acc.find(
                (item) => item.type === party.seurue_tyyppi_nimi
            )?.data.push(party);
        }
        return acc;
    }, [] as { type: string; data: PartyViewQuery[] }[]);

    return (
        <>
            {partiesByType && (
                <SectionList
                    sections={partiesByType}
                    keyExtractor={(item) => item.seurue_id.toString()}
                    renderItem={({ item }) => <PartyListItem party={item} />}
                    renderSectionHeader={({ section: { type } }) => (
                        <Text
                            variant="titleMedium"
                            style={{
                                color: theme.colors.primary,
                                paddingLeft: 16,
                                paddingTop: 20,
                            }}
                        >
                            {`${type} Seurueet`}
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

export default PartyScreen;
