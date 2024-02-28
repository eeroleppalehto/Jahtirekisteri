import { PartyViewQuery } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { RefreshControl } from "react-native-gesture-handler";
import PartyListItem from "./PartyListItem";
import { Text, useTheme } from "react-native-paper";
import { SectionList } from "react-native";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import { useState } from "react";

type Props = MaintenanceTabScreenProps<"Seurueet">;

function PartyScreen({ navigation, route }: Props) {
    const [scrollValue, setScrollValue] = useState(0);

    const result = useFetchQuery<PartyViewQuery[]>(
        `views/?name=mobiili_seurue_sivu`,
        ["Parties"]
    );

    const theme = useTheme();

    // Generate sections for SectionList
    const partiesByType = (parties: PartyViewQuery[]) => {
        return parties.reduce((acc, party) => {
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
    };

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess && (
                <SectionList
                    sections={partiesByType(result.data) || []}
                    keyExtractor={(item, index) => {
                        // return item.seurue_id.toString() // Why is this throwing an error?
                        return index.toString();
                    }}
                    renderItem={({ item }) => (
                        <PartyListItem party={item} navigation={navigation} />
                    )}
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
                            refreshing={result.isLoading}
                            onRefresh={result.refetch}
                        />
                    }
                />
            )}
            <FloatingNavigationButton
                scrollValue={scrollValue}
                type="Party"
                label="Lisää seurue"
            />
        </>
    );
}

export default PartyScreen;
