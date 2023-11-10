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

function ShooterModal({
    visible,
    setVisibility,
    shooterId,
    onValueChange,
    onButtonPress,
}: Props) {
    const results = useFetch<Shooter[]>("view/?viewName=nimivalinta");

    const theme = useTheme();

    // const handleChange = (value: string) => {
    //     const shooter = results.data?.find(
    //         (item) => item.jasen_id === parseInt(value)
    //     );
    //     shooter
    //         ? onValueChange({
    //               jasen_id: shooter.jasen_id,
    //               kokonimi: shooter.kokonimi,
    //           })
    //         : null;
    // };

    const handleChange = (value: string) => {
        const selectedShooter = results.data?.find(
            (item) => item.jasen_id === parseInt(value)
        );
        onValueChange(selectedShooter!);
    };

    if (results.error) {
        return <Text>{results.error.message}</Text>;
    }

    const initialValue = shooterId
        ? shooterId.toString()
        : results.data
        ? results.data[0].jasen_id.toString()
        : "";

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
