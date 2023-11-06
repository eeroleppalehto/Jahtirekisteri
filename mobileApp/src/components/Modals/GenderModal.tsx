import useFetch from "../../../hooks/useFetch";
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

type Gender = {
    sukupuoli: string;
};

type Props = {
    visible: boolean;
    setVisibility: (value: boolean) => void;
    gender: string | undefined;
    onValueChange: (value: string) => void;
    onButtonPress: () => void;
};

function GenderModal({
    visible,
    setVisibility,
    gender,
    onValueChange,
    onButtonPress,
}: Props) {
    const results = useFetch<Gender[]>("option-tables/sukupuoli", "GET", null);
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
                        <Text variant="headlineMedium">Ikäluokka</Text>
                    </View>
                    <Divider style={{ marginVertical: 15 }} />
                    <RadioButton.Group
                        onValueChange={(value) => onValueChange(value)}
                        value={gender ? gender : ""}
                    >
                        {results.data?.map((item) => (
                            <RadioButton.Item
                                label={item.sukupuoli}
                                value={item.sukupuoli}
                                key={item.sukupuoli}
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

export default GenderModal;
