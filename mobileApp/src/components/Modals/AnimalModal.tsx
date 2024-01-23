import useFetch from "../../hooks/useFetch";
import { View, StyleSheet } from "react-native";
import {
    RadioButton,
    Text,
    ActivityIndicator,
    Divider,
    Button,
    Modal,
    useTheme,
} from "react-native-paper";

type Animal = {
    elaimen_nimi: string;
};

type Props = {
    visible: boolean;
    setVisibility: (value: boolean) => void;
    animal: string | undefined;
    onValueChange: (value: string) => void;
    onButtonPress: () => void;
};

// Modal for selecting animal
function AnimalModal({
    visible,
    setVisibility,
    animal,
    onValueChange,
    onButtonPress,
}: Props) {
    // Get animals from database
    const results = useFetch<Animal[]>("option-tables/animals");
    const theme = useTheme();

    // Return loading indicator if data is still loading,
    // otherwise generate radio buttons for each animal
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
                        <Text variant="headlineMedium">Eläin</Text>
                    </View>
                    <Divider style={{ marginVertical: 15 }} />
                    <RadioButton.Group
                        onValueChange={(value) => onValueChange(value)}
                        value={animal ? animal : ""}
                    >
                        {results.data?.map((item) => (
                            <RadioButton.Item
                                label={item.elaimen_nimi}
                                value={item.elaimen_nimi}
                                key={item.elaimen_nimi}
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

export default AnimalModal;
