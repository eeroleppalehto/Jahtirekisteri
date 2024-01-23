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
    visible: boolean;
    setVisibility: (value: boolean) => void;
    usageForm: UsageForm | undefined;
    onValueChange: (value: Usage | undefined) => void;
    onButtonPress: () => void;
};

// Modal for selecting usage
function UsageModal({
    visible,
    setVisibility,
    usageForm,
    onValueChange,
    onButtonPress,
}: Props) {
    // Get usages from database
    const results = useFetch<Usage[]>("option-tables/usages");
    const theme = useTheme();

    // Callback function for changing the selected usage
    const handleChange = (value: string) => {
        // Find the selected usage from the results
        const selectedUsage = results.data?.find(
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
        : results.data
        ? results.data[0].kasittelyid.toString()
        : "";

    // Return loading indicator if data is still loading,
    // otherwise generate radio buttons for each usage
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
                        <Text variant="headlineMedium">Ikäluokka</Text>
                    </View>
                    <Divider style={{ marginVertical: 15 }} />
                    <RadioButton.Group
                        onValueChange={(value) => handleChange(value)}
                        value={initialValue ? initialValue : ""}
                    >
                        {results.data?.map((item) => (
                            <RadioButton.Item
                                label={item.kasittely_teksti}
                                value={item.kasittelyid.toString()}
                                key={item.kasittelyid}
                            />
                        ))}
                    </RadioButton.Group>
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

export default UsageModal;
