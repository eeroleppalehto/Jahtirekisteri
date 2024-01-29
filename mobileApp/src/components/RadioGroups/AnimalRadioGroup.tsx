import useFetch from "../../hooks/useFetch";
import { RadioButton, ActivityIndicator, useTheme } from "react-native-paper";

type Animal = {
    elaimen_nimi: string;
};

type Props = {
    animal: string | undefined;
    onValueChange: (value: string) => void;
};

export function AnimalRadioGroup({ animal, onValueChange }: Props) {
    const { data, error, loading } = useFetch<Animal[]>(
        "option-tables/animals"
    );
    const theme = useTheme();

    return (
        <>
            {loading && (
                <ActivityIndicator
                    size={"large"}
                    style={{ paddingVertical: 50 }}
                />
            )}
            {data && (
                <RadioButton.Group
                    onValueChange={(value) => onValueChange(value)}
                    value={animal ? animal : ""}
                >
                    {data.map((item) => (
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
