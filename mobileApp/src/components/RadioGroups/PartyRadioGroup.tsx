import { useState } from "react";
import { StyleSheet } from "react-native";
import { RadioButton, useTheme } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { PartyViewQuery } from "../../types";

type Props = {
    partyId: number | undefined;
    onValueChange: (value: number | undefined) => void;
};

export function PartyRadioGroup({ partyId, onValueChange }: Props) {
    const result = useFetchQuery<PartyViewQuery[]>(
        `views/?name=mobiili_seurue_sivu`,
        ["Parties"]
    );

    const theme = useTheme();

    const groupParties = (parties: PartyViewQuery[]) => {
        return parties.filter((party) => party.seurue_tyyppi_nimi === "Ryhmä");
    };

    const length = result.isSuccess ? groupParties(result.data).length : 0;

    return (
        <>
            {result.isSuccess ? (
                <RadioButton.Group
                    onValueChange={(value) => onValueChange(parseInt(value))}
                    value={partyId ? partyId.toString() : "0"}
                >
                    {groupParties(result.data).map((party, index) => {
                        let style = {};

                        if (index === 0) style = styles.firstItem;
                        if (index === length - 1)
                            style = { ...style, ...styles.lastItem };

                        return (
                            <RadioButton.Item
                                key={party.seurue_id}
                                style={{
                                    ...style,
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.surfaceVariant,
                                }}
                                label={party.seurueen_nimi}
                                value={party.seurue_id.toString()}
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
