import useFetch from "../../hooks/useFetch";
import { ScrollView, View, StyleSheet } from "react-native";
import {
    RadioButton,
    Text,
    ActivityIndicator,
    Divider,
    Button,
    Modal,
    useTheme,
} from "react-native-paper";
import { UsageForm } from "../../types";

type Usage = {
    kasittelyid: number;
    kasittely_teksti: string;
};

type Props = {
    usageForm: UsageForm | undefined;
    onValueChange: (value: Usage | undefined) => void;
};

export function UsageRadioGroup({ usageForm, onValueChange }: Props) {
    const { data, error, loading } = useFetch<Usage[]>("option-tables/usages");
    const theme = useTheme();

    const handleChange = (value: string) => {
        // Find the selected usage from the results
        const selectedUsage = data?.find(
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
        : data
        ? data[0].kasittelyid.toString()
        : "";

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
                    onValueChange={(value) => handleChange(value)}
                    value={initialValue ? initialValue : ""}
                >
                    {data.map((item) => (
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
