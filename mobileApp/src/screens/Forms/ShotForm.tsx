import {
    TextInput,
    Modal,
    Portal,
    Text,
    MD3Colors,
    IconButton,
    useTheme,
    Divider,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { KaatoForm } from "../../types";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";

function ShotForm() {
    const [visible, setVisible] = useState(false);
    const [shotForm, setShotForm] = useState<KaatoForm>({
        jasen_id: 0,
        paikka_teksti: "",
        paikka_koordinaatti: "",
        kaatopaiva: "",
        ruhopaino: 0,
        elaimen_nimi: "",
        ikaluokka: "",
        sukupuoli: "",
        lisatieto: "",
    });
    const [testText, setTestText] = useState("");

    const theme = useTheme();

    const mode = "flat";

    return (
        <ScrollView>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Text variant="titleMedium">Lisää kaato</Text>
                </Modal>
            </Portal>
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                }}
            >
                Paikka ja kaataja tiedot
            </Text>
            <View style={styles.container}>
                <CustomInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="account"
                    title="Kaataja"
                    value=""
                    iconButtonName="account-plus-outline"
                    onPress={() => console.log("testi")}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="location-on"
                    label="*Paikka"
                    inputType="default"
                    value={testText}
                    onChangeText={setTestText}
                />
                <CustomInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="calendar"
                    title="Kaato päivä"
                    value=""
                    iconButtonName="calendar-plus"
                    onPress={() => console.log("testi")}
                />
                <Divider />
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    Eläimen tiedot
                </Text>
                <CustomInput
                    iconSet="NoIcon"
                    //iconNameMaterialCommunity="calendar"
                    title="Eläinlaji"
                    value=""
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <CustomInput
                    iconSet="NoIcon"
                    //iconNameMaterialCommunity="calendar"
                    title="Ikäluokka"
                    value=""
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <CustomInput
                    iconSet="NoIcon"
                    //iconNameMaterialCommunity="calendar"
                    title="Sukupuoli"
                    value=""
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="scale"
                    label="*Ruhopaino"
                    inputType="numeric"
                    value={testText}
                    onChangeText={setTestText}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="information"
                    label="Lisätietoja"
                    inputType="default"
                    value={testText}
                    onChangeText={setTestText}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { paddingBottom: 150 },
    modal: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
});

export default ShotForm;
