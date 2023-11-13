import useFetch from "../../../hooks/useFetch";
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

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = {
    visible: boolean;
    setVisibility: (value: boolean) => void;
    shooterId: number | undefined;
    onValueChange: (value: Shooter) => void;
    onButtonPress: () => void;
};

// Modal for selecting shooter
function ShooterModal({
    visible,
    setVisibility,
    shooterId,
    onValueChange,
    onButtonPress,
}: Props) {
    // Get shooters from database
    const results = useFetch<Shooter[]>("view/?viewName=nimivalinta");
    const theme = useTheme();

    // Callback function for changing the selected shooter
    const handleChange = (value: string) => {
        // Find the selected shooter from the results
        const selectedShooter = results.data?.find(
            (item) => item.jasen_id === parseInt(value)
        );
        // Pass the selected shooter to the parent components callback function
        onValueChange(selectedShooter!);
    };

    if (results.error) {
        return <Text>{results.error.message}</Text>;
    }

    // If shooterId is defined, use it as the initial value,
    // otherwise use the first shooter from the results.
    // If results are still loading, use an empty string
    const initialValue = shooterId
        ? shooterId.toString()
        : results.data
        ? results.data[0].jasen_id.toString()
        : "";

    // Return loading indicator if data is still loading,
    // otherwise generate radio buttons for each shooter
    // and return the modal
    return (
        <Modal
            visible={visible}
            onDismiss={() => setVisibility(false)}
            contentContainerStyle={{
                ...styles.modal,
                backgroundColor: theme.colors.surface,
            }}
        >
            {results.loading ? (
                <ActivityIndicator
                    size={"large"}
                    style={{ paddingVertical: 50 }}
                />
            ) : (
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Text variant="headlineMedium">Kaatajat</Text>
                    </View>
                    <Divider style={{ marginVertical: 15 }} />
                    <ScrollView>
                        <RadioButton.Group
                            onValueChange={(value) => handleChange(value)}
                            value={initialValue}
                        >
                            {results.data?.map((item) => (
                                <RadioButton.Item
                                    label={item.kokonimi}
                                    value={item.jasen_id.toString()}
                                    key={item.jasen_id}
                                />
                            ))}
                        </RadioButton.Group>
                    </ScrollView>
                    <Divider style={{ marginVertical: 15 }} />
                    <Button onPress={() => onButtonPress()}>Valitse</Button>
                </>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        padding: 20,
        margin: 20,
        borderRadius: 10,
        maxHeight: "90%",
    },
});

export default ShooterModal;
