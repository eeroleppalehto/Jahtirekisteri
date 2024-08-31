import { RadioButton, Searchbar, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { DefaultActivityIndicator } from "../DefaultActivityIndicator";
import { ErrorScreen } from "../../screens/ErrorScreen";
import { useCallback, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GroupViewQuery } from "../../types";
import { RadioButtonItem } from "./RadioButtonItem";

type Group = {
    ryhma_id: number;
    ryhman_nimi: string;
};

type Props = {
    groupId: number | undefined;
    onValueChange: (value: Group) => void;
    partyId: number | undefined;
};

export function GroupRadioGroup({ groupId, onValueChange, partyId }: Props) {
    const [selectedGroup, setSelectedGroup] = useState<number | undefined>(
        groupId
    );

    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const result = useFetchQuery<GroupViewQuery[]>(
        `views/?name=mobiili_ryhma_sivu&column=seurue.seurue_id&value=${
            partyId ?? 0
        }`,
        ["Groups", `Party: ${partyId}`]
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(!true);
        result.refetch();
    }, []);

    const handleChange = (value: string) => {
        setSelectedGroup(parseInt(value));
        // Find the selected membership from the results
        const selectedGroupData = result.data?.find(
            (item) => item.ryhma_id === parseInt(value)
        );

        // Pass the selected shooter to the parent components callback function
        onValueChange({
            ryhma_id: parseInt(value),
            ryhman_nimi: selectedGroupData?.ryhman_nimi ?? "",
        });
    };

    const theme = useTheme();

    const filteredResults = result.data?.filter((item) =>
        item.ryhman_nimi.toLowerCase().includes(search.toLowerCase())
    );
    // TODO: On first render the status of the radio buttons is not shown correctly. The first item is selected, but the state is not updated.
    return (
        <>
            <Searchbar
                placeholder="Hae jäsenyyttä"
                value={search}
                onChangeText={setSearch}
            />
            {result.isLoading && <DefaultActivityIndicator />}
            {result.isError && <ErrorScreen error={result.error} />}
            {result.isSuccess && (
                <BottomSheetFlatList
                    data={filteredResults}
                    keyExtractor={(item) => item.ryhma_id.toString()}
                    renderItem={({ item }) => (
                        <RadioButtonItem
                            label={item.ryhman_nimi}
                            value={item.ryhma_id.toString()}
                            theme={theme}
                            status={
                                selectedGroup === item.ryhma_id
                                    ? "checked"
                                    : "unchecked"
                            }
                            onPress={handleChange}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </>
    );
}
