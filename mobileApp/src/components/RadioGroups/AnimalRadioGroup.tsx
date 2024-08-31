import { RadioButton, ActivityIndicator } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../../screens/ErrorScreen";

type Animal = {
    elaimen_nimi: string;
};

type Props = {
    animal: string | undefined;
    onValueChange: (value: string) => void;
};

export function AnimalRadioGroup({ animal, onValueChange }: Props) {
    const result = useFetchQuery<Animal[]>("option-tables/animals", [
        "Animals",
    ]);

    return (
        <>
            {result.isLoading && (
                <ActivityIndicator
                    size={"large"}
                    style={{ paddingVertical: 20 }}
                />
            )}
            {result.isError && (
                <ErrorScreen error={result.error} reload={result.refetch} />
            )}
            {result.isSuccess && (
                <RadioButton.Group
                    onValueChange={(value) => onValueChange(value)}
                    value={animal ? animal : ""}
                >
                    {result.data.map((item) => (
                        <RadioButton.Item
                            label={item.elaimen_nimi}
                            value={item.elaimen_nimi}
                            key={item.elaimen_nimi}
                        />
                    ))}
                </RadioButton.Group>
            )}
        </>
    );
}
