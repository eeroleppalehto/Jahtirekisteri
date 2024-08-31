import { RadioButton, useTheme } from "react-native-paper";
import { ErrorScreen } from "../../screens/ErrorScreen";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { StyleSheet } from "react-native";
import { DefaultActivityIndicator } from "../DefaultActivityIndicator";

type Portion = {
    osnimitys: string;
    osnimitys_suhdeluku: number;
};

type Props = {
    portionName: string | undefined;
    onValueChange: (value: string) => void;
};

export function PortionRadioGroup({ portionName, onValueChange }: Props) {
    const result = useFetchQuery<Portion[]>(`option-tables/portions`, [
        "Portion",
    ]);

    const handleChange = (value: string) => {
        onValueChange(value);
    };

    const theme = useTheme();

    const sortedResults = result.data?.sort((a, b) =>
        a.osnimitys_suhdeluku > b.osnimitys_suhdeluku ? -1 : 1
    );

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess ? (
                <RadioButton.Group
                    onValueChange={handleChange}
                    value={portionName ? portionName : ""}
                >
                    {result.data.map((portion, index) => {
                        let style = { ...styles.allItems };

                        if (index === 0)
                            style = { ...styles.firstItem, ...style };
                        if (index === result.data.length - 1)
                            style = { ...style, ...styles.lastItem };

                        return (
                            <RadioButton.Item
                                key={portion.osnimitys_suhdeluku}
                                style={{
                                    ...style,
                                    marginTop: 2,
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.surfaceVariant,
                                }}
                                label={portion.osnimitys}
                                value={portion.osnimitys}
                            />
                        );
                    })}
                </RadioButton.Group>
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    allItems: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    firstItem: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
    },
    lastItem: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
    },
    onlyItem: {
        borderWidth: 1,
        borderRadius: 24,
    },
});
