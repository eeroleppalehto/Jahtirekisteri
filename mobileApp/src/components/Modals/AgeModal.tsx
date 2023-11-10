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

type Age = {
    ikaluokka: string;
};

type Props = {
    visible: boolean;
    setVisibility: (value: boolean) => void;
    age: string | undefined;
    onValueChange: (value: string) => void;
    onButtonPress: () => void;
};

// Modal for selecting age group
function AgeModal({
    visible,
    setVisibility,
    age,
    onValueChange,
    onButtonPress,
}: Props) {
    // Get age groups from database
    const results = useFetch<Age[]>("option-tables/aikuinenvasa");
    const theme = useTheme();

    // Return loading indicator if data is still loading,
    // otherwise generate radio buttons for each age group
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
                        onValueChange={(value) => onValueChange(value)}
                        value={age ? age : ""}
                    >
                        {results.data?.map((item) => (
                            <RadioButton.Item
                                label={item.ikaluokka}
                                value={item.ikaluokka}
                                key={item.ikaluokka}
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

export default AgeModal;
