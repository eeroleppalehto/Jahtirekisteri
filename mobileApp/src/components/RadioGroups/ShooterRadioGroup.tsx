import useFetch from "../../hooks/useFetch";
import { RadioButton, Text, ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = {
    shooterId: number | undefined;
    onValueChange: (value: Shooter) => void;
};

export function ShooterRadioGroup({ shooterId, onValueChange }: Props) {
    // Get shooters from database
    const { data, error, loading } = useFetch<Shooter[]>(
        "views/?name=nimivalinta"
    );

    // Callback function for changing the selected shooter
    const handleChange = (value: string) => {
        // Find the selected shooter from the results
        const selectedShooter = data?.find(
            (item) => item.jasen_id === parseInt(value)
        );
        // Pass the selected shooter to the parent components callback function
        onValueChange(selectedShooter!);
    };

    if (error) {
        return <Text>{error.message}</Text>;
    }

    // If shooterId is defined, use it as the initial value,
    // otherwise use the first shooter from the results.
    // If results are still loading, use an empty string
    const initialValue = shooterId
        ? shooterId.toString()
        : data
        ? data[0].jasen_id.toString()
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
                <ScrollView>
                    <RadioButton.Group
                        onValueChange={(value) => handleChange(value)}
                        value={initialValue}
                    >
                        {data.map((item) => (
                            <RadioButton.Item
                                label={item.kokonimi}
                                value={item.jasen_id.toString()}
                                key={item.jasen_id}
                            />
                        ))}
                    </RadioButton.Group>
                </ScrollView>
            )}
        </>
    );
}
