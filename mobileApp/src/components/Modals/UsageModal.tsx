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

function UsageModal({
    visible,
    setVisibility,
    usageForm,
    onValueChange,
    onButtonPress,
}: Props) {
    const results = useFetch<Usage[]>("option-tables/kasittely");
    const theme = useTheme();

    // const handleChange = (value: string) => {
    //     const usage = results.data?.find(
    //         (item) => item.kasittelyid === parseInt(value)
    //     );
    //     usage
    //         ? onValueChange({
    //               kasittelyid: usage.kasittelyid,
    //               kasittely_maara: usageForm.kasittely_maara,
    //           })
    //         : null;
    // };

    const handleChange = (value: string) => {
        const selectedUsage = results.data?.find(
            (item) => item.kasittelyid === parseInt(value)
        );
        onValueChange(selectedUsage);
    };

    const initialValue = usageForm
        ? usageForm.kasittelyid?.toString()
        : results.data
        ? results.data[0].kasittelyid.toString()
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
