import { RadioButton, Searchbar, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { DefaultActivityIndicator } from "../DefaultActivityIndicator";
import { ErrorScreen } from "../../screens/ErrorScreen";
import { useCallback, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { MembershipViewQuery } from "../../types";
import { RadioButtonItem } from "./RadioButtonItem";

type Membership = {
    jasenyys_id: number;
    jasenen_nimi: string;
};

type Props = {
    membershipId: number | undefined;
    onValueChange: (value: Membership) => void;
    partyId: number | undefined;
};

export function MembershipRadioGroup({
    membershipId,
    onValueChange,
    partyId,
}: Props) {
    const [selectedMembership, setSelectedMembership] = useState<
        number | undefined
    >(membershipId);

    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const result = useFetchQuery<MembershipViewQuery[]>(
        `views/?name=mobiili_seurueen_jasenyydet&column=seurue.seurue_id&value=${
            partyId ?? 0
        }`,
        ["seurueen_jasenyydet", partyId]
    );

    const theme = useTheme();

    const filteredResults = result.data?.filter((item) =>
        item.jasenen_nimi.toLowerCase().includes(search.toLowerCase())
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(!true);
        result.refetch();
    }, []);

    const handleChange = (value: string) => {
        setSelectedMembership(parseInt(value));
        // Find the selected membership from the results
        const selectedMembershipData = result.data?.find(
            (item) => item.jasenyys_id === parseInt(value)
        );

        // Pass the selected shooter to the parent components callback function
        onValueChange({
            jasenyys_id: parseInt(value),
            jasenen_nimi: selectedMembershipData?.jasenen_nimi ?? "",
        });
    };

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
                // <RadioButton.Group
                //     onValueChange={(value) => onValueChange(parseInt(value))}
                //     value={membershipId ? membershipId.toString() : ""}
                // >
                //     {filteredResults.map((item) => (
                //         <RadioButton.Item
                //             key={item.jasen_id.toString()}
                //             label={item.jasenen_nimi}
                //             value={item.jasen_id.toString()}
                //         />
                //     ))}
                // </RadioButton.Group>
                <BottomSheetFlatList
                    data={filteredResults}
                    keyExtractor={(item) => item.jasenyys_id.toString()}
                    renderItem={({ item }) => (
                        <RadioButtonItem
                            label={item.jasenen_nimi}
                            value={item.jasenyys_id.toString()}
                            theme={theme}
                            status={
                                selectedMembership === item.jasenyys_id
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
