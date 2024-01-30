import { RadioButton, ActivityIndicator } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../../screens/ErrorScreen";

type Gender = {
    sukupuoli: string;
};

type Props = {
    gender: string | undefined;
    onValueChange: (value: string) => void;
};

export function GenderRadioGroup({ gender, onValueChange }: Props) {
    // const { data, loading, error } = useFetch<Gender[]>(
    //     "option-tables/genders"
    // );

    const result = useFetchQuery<Gender[]>("option-tables/genders", "Genders");

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
                    value={gender ? gender : ""}
                >
                    {result.data?.map((item) => (
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
