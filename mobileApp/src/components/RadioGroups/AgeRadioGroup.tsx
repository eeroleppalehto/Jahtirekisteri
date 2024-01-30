import { RadioButton, ActivityIndicator } from "react-native-paper";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../../screens/ErrorScreen";

type Age = {
    ikaluokka: string;
};

type Props = {
    age: string | undefined;
    onValueChange: (value: string) => void;
};

export function AgeRadioGroup({ age, onValueChange }: Props) {
    // const { data, error, loading } = useFetch<Age[]>("option-tables/ages");

    const result = useFetchQuery<Age[]>("option-tables/ages", "Ages");

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
                    value={age ? age : ""}
                >
                    {result.data.map((item) => (
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
