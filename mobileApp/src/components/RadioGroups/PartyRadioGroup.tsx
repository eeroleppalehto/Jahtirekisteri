import { StyleSheet, View } from "react-native";
import { RadioButton, useTheme, Text } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { PartyViewQuery } from "../../types";

type Props = {
    partyId: number | undefined;
    onValueChange: (value: number | undefined) => void;
    type: "Ryhmä" | "Jäsen" | undefined;
    title?: string;
};

export function PartyRadioGroup({
    partyId,
    onValueChange,
    type,
    title,
}: Props) {
    const result = useFetchQuery<PartyViewQuery[]>(
        `views/?name=mobiili_seurue_sivu`,
        ["Parties"]
    );

    const theme = useTheme();

    const filterParties = (parties: PartyViewQuery[]) => {
        if (type) {
            return parties.filter((party) => party.seurue_tyyppi_nimi === type);
        }
        return parties;
    };

    const length = result.isSuccess ? filterParties(result.data).length : 0;

    return (
        <View>
            {title ? (
                <View
                    style={{
                        ...styles.firstItem,
                        padding: 12,
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.surfaceVariant,
                        alignItems: "center",
                    }}
                >
                    <Text
                        variant="titleMedium"
                        style={{ color: theme.colors.primary }}
                    >
                        {title}
                    </Text>
                </View>
            ) : null}
            {result.isSuccess ? (
                <RadioButton.Group
                    onValueChange={(value) => onValueChange(parseInt(value))}
                    value={partyId ? partyId.toString() : "0"}
                >
                    {filterParties(result.data).map((party, index) => {
                        let style = {};

                        if (index === 0 && !title) style = styles.firstItem;
                        if (index === length - 1)
                            style = { ...style, ...styles.lastItem };

                        return (
                            <RadioButton.Item
                                key={party.seurue_id}
                                style={{
                                    ...style,
                                    marginTop: 2,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
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
        </View>
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
        borderBottomWidth: 1,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
    },
});
