import { Modal, Portal, Text, useTheme, Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { KaatoForm } from "../../types";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";
import DatePicker from "../../components/DatePicker";
import ShooterModalContent from "../ShooterModalContent";

type Shooter = {
    jasen_id: number | undefined;
    kokonimi: string | undefined;
};

function ShotForm() {
    const [shotDate, setShotDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [shooter, setShooter] = useState<Shooter>({
        jasen_id: undefined,
        kokonimi: undefined,
    });
    const [shooterText, setShooterText] = useState("");
    const [visible, setVisible] = useState(false);
    const [testText, setTestText] = useState("");

    const theme = useTheme();

    return (
        <ScrollView>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{
                        ...styles.modal,
                        backgroundColor: theme.colors.surface,
                    }}
                >
                    <ShooterModalContent onValueChange={setShooterText} />
                </Modal>
            </Portal>
            <DatePicker
                initDate={shotDate}
                setDate={setShotDate}
                open={calendarOpen}
                setOpen={setCalendarOpen}
            />
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
                    required={true}
                    valueState={shooter.kokonimi}
                    placeholder="Ei valittua kaatajaa"
                    iconButtonName="account-plus-outline"
                    onPress={() => setVisible(true)}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="location-on"
                    label="Paikka"
                    required={true}
                    inputType="default"
                    value={testText}
                    onChangeText={setTestText}
                />
                <CustomInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="calendar"
                    title="Kaatopäivä"
                    required={true}
                    valueState={shotDate?.toLocaleDateString("fi-FI")}
                    placeholder="Ei valittua päivää"
                    iconButtonName="calendar-plus"
                    onPress={() => setCalendarOpen(true)}
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
                    title="Eläinlaji"
                    valueState=""
                    required={true}
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <CustomInput
                    iconSet="NoIcon"
                    title="Ikäluokka"
                    valueState=""
                    required={true}
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <CustomInput
                    iconSet="NoIcon"
                    title="Sukupuoli"
                    valueState=""
                    required={true}
                    iconButtonName="plus"
                    onPress={() => console.log("testi")}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="scale"
                    label="Ruhopaino"
                    required={true}
                    inputType="numeric"
                    value={testText}
                    onChangeText={setTestText}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="information"
                    label="Lisätietoja"
                    required={false}
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
        padding: 20,
        margin: 20,
        borderRadius: 10,
        maxHeight: "90%",
    },
});

export default ShotForm;
