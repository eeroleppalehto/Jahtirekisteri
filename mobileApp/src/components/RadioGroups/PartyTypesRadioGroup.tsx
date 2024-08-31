import { RadioButton, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { StyleSheet } from "react-native";
import { PartyType } from "../../types";

type Props = {
    partyTypeId: number | undefined;
    onValueChange: (value: PartyType) => void;
};

export function PartyTypesRadioGroup({ partyTypeId, onValueChange }: Props) {
    const handleChange = (value: string) => {
        // Find the selected party type from the results
        const selectedPartyType = result.data?.find(
            (item) => item.seurue_tyyppi_id === parseInt(value)
        );
        // Pass the selected party type to the parent components callback function
        onValueChange(selectedPartyType!);
    };

    const theme = useTheme();

    const result = useFetchQuery<PartyType[]>(`option-tables/party-types`, [
        "PartyTypes",
    ]);

    const length = result.isSuccess ? result.data.length : 0;

    return (
        <>
            {result.isSuccess ? (
                <RadioButton.Group
                    onValueChange={(value) => handleChange(value)}
                    value={partyTypeId ? partyTypeId.toString() : "0"}
                >
                    {result.data.map((party, index) => {
                        let style = {};

                        if (index === 0) style = styles.firstItem;
                        if (index === length - 1)
                            style = { ...style, ...styles.lastItem };

                        return (
                            <RadioButton.Item
                                key={party.seurue_tyyppi_id}
                                style={{
                                    ...style,
                                    marginTop: 2,
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.surfaceVariant,
                                }}
                                label={party.seurue_tyyppi_nimi}
                                value={party.seurue_tyyppi_id.toString()}
                            />
                        );
                    })}
                </RadioButton.Group>
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    firstItem: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
    },
    lastItem: {
        borderWidth: 1,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
    },
});
