import useFetch from "../../hooks/useFetch";
import { RadioButton, ActivityIndicator } from "react-native-paper";

type Age = {
    ikaluokka: string;
};

type Props = {
    age: string | undefined;
    onValueChange: (value: string) => void;
};

export function AgeRadioGroup({ age, onValueChange }: Props) {
    const { data, error, loading } = useFetch<Age[]>("option-tables/ages");

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
                    value={age ? age : ""}
                >
                    {data.map((item) => (
                        <RadioButton.Item
                            label={item.ikaluokka}
                            value={item.ikaluokka}
                            key={item.ikaluokka}
                        />
                    ))}
                </RadioButton.Group>
            )}
        </>
    );
}
