import useFetch from "../../hooks/useFetch";
import { RadioButton, ActivityIndicator, useTheme } from "react-native-paper";

type Gender = {
    sukupuoli: string;
};

type Props = {
    gender: string | undefined;
    onValueChange: (value: string) => void;
};

export function GenderRadioGroup({ gender, onValueChange }: Props) {
    const { data, loading, error } = useFetch<Gender[]>(
        "option-tables/genders"
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
                    value={gender ? gender : ""}
                >
                    {data?.map((item) => (
                        <RadioButton.Item
                            label={item.sukupuoli}
                            value={item.sukupuoli}
                            key={item.sukupuoli}
                        />
                    ))}
                </RadioButton.Group>
            )}
        </>
    );
}
