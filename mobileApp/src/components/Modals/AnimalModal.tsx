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
    elaimen_nimi: string;
};

type Props = {
    visible: boolean;
    setVisibility: (value: boolean) => void;
    age: string | undefined;
    onValueChange: (value: string) => void;
    onButtonPress: () => void;
};

function AnimalModal({
    visible,
    setVisibility,
    age,
    onValueChange,
    onButtonPress,
}: Props) {
    const results = useFetch<Age[]>("option-tables/elain", "GET", null);
    const theme = useTheme();

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
                        value={age ? age : ""}
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
