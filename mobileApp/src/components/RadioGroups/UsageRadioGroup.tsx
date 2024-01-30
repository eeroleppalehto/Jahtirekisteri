import { RadioButton, ActivityIndicator } from "react-native-paper";
import { UsageForm } from "../../types";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../../screens/ErrorScreen";

type Usage = {
    kasittelyid: number;
    kasittely_teksti: string;
};

type Props = {
    usageForm: UsageForm | undefined;
    onValueChange: (value: Usage | undefined) => void;
};

export function UsageRadioGroup({ usageForm, onValueChange }: Props) {
    const result = useFetchQuery<Usage[]>("option-tables/usages", "Usages");

    const handleChange = (value: string) => {
        // Find the selected usage from the results
        const selectedUsage = result.data?.find(
            (item) => item.kasittelyid === parseInt(value)
        );
        // Pass the selected usage to the parent components callback function
        onValueChange(selectedUsage);
    };

    // If usageForm is defined, use it as the initial value,
    // otherwise use the first usage from the results.
    // If results are still loading, use an empty string
    const initialValue = usageForm
        ? usageForm.kasittelyid?.toString()
        : result.data
        ? result.data[0].kasittelyid.toString()
        : "";

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
                    onValueChange={(value) => handleChange(value)}
                    value={initialValue ? initialValue : ""}
                >
                    {result.data.map((item) => (
                        <RadioButton.Item
                            label={item.kasittely_teksti}
                            value={item.kasittelyid.toString()}
                            key={item.kasittelyid}
                        />
                    ))}
                </RadioButton.Group>
            )}
        </>
    );
}
