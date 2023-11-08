import {
    Modal,
    Portal,
    Text,
    useTheme,
    Divider,
    Button,
    Switch,
    Surface,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";
import DatePicker from "../../components/DatePicker";
import ShooterModal from "../../components/Modals/ShooterModal";
import AnimalModal from "../../components/Modals/AnimalModal";
import AgeModal from "../../components/Modals/AgeModal";
import GenderModal from "../../components/Modals/GenderModal";
import UsageModal from "../../components/Modals/UsageModal";
import Slider from "@react-native-community/slider";
//import { useFetch } from "../../hooks/useFetch";
import FloatingActionButton from "../../components/FloatingActionButton";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Usage = {
    kasittelyid: number;
    kasittely_teksti: string;
};

function ShotForm() {
    const [shotDate, setShotDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [shotLocation, setShotLocation] = useState("");
    const [shooter, setShooter] = useState<Shooter | undefined>(undefined);
    const [animal, setAnimal] = useState<string | undefined>(undefined);
    const [age, setAge] = useState<string | undefined>(undefined);
    const [gender, setGender] = useState<string | undefined>(undefined);
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [info, setInfo] = useState<string | undefined>(undefined);

    const [firstUsage, setFirstUsage] = useState<Usage | undefined>(undefined);
    const [firstUsageAmount, setFirstUsageAmount] = useState<number>(100);

    const [secondUsageEnabled, setSecondUsageEnabled] =
        useState<boolean>(false);
    const [secondUsage, setSecondUsage] = useState<Usage | undefined>(
        undefined
    );
    const [secondUsageAmount, setSecondUsageAmount] = useState<number>(0);

    const [shooterModalVisible, setShooterModalVisible] = useState(false);
    const [animalModalVisible, setAnimalModalVisible] = useState(false);
    const [ageModalVisible, setAgeModalVisible] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [firstUsageModalVisible, setFirstUsageModalVisible] = useState(false);
    const [secondUsageModalVisible, setSecondUsageModalVisible] =
        useState(false);

    const theme = useTheme();

    const handleFirstSliderChange = (value: number) => {
        setFirstUsageAmount(value);
        setSecondUsageAmount(100 - value);
    };

    const handleSecondSliderChange = (value: number) => {
        setSecondUsageAmount(value);
        setFirstUsageAmount(100 - value);
    };

    return (
        <>
            <Portal>
                <DatePicker
                    initDate={shotDate}
                    setDate={setShotDate}
                    open={calendarOpen}
                    setOpen={setCalendarOpen}
                />
                <ShooterModal
                    visible={shooterModalVisible}
                    setVisibility={setShooterModalVisible}
                    onValueChange={setShooter}
                    shooterState={shooter}
                    onButtonPress={() => setShooterModalVisible(false)}
                />
                <AnimalModal
                    visible={animalModalVisible}
                    setVisibility={setAnimalModalVisible}
                    age={animal}
                    onValueChange={setAnimal}
                    onButtonPress={() => setAnimalModalVisible(false)}
                />
                <AgeModal
                    visible={ageModalVisible}
                    setVisibility={setAgeModalVisible}
                    animal={age}
                    onValueChange={setAge}
                    onButtonPress={() => setAgeModalVisible(false)}
                />
                <GenderModal
                    visible={genderModalVisible}
                    setVisibility={setGenderModalVisible}
                    gender={gender}
                    onValueChange={setGender}
                    onButtonPress={() => setGenderModalVisible(false)}
                />
                <UsageModal
                    visible={firstUsageModalVisible}
                    setVisibility={setFirstUsageModalVisible}
                    usage={firstUsage}
                    onValueChange={setFirstUsage}
                    onButtonPress={() => setFirstUsageModalVisible(false)}
                />
                <UsageModal
                    visible={secondUsageModalVisible}
                    setVisibility={setSecondUsageModalVisible}
                    usage={secondUsage}
                    onValueChange={setSecondUsage}
                    onButtonPress={() => setSecondUsageModalVisible(false)}
                />
            </Portal>
            <ScrollView>
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
                        valueState={shooter?.kokonimi}
                        placeholder="Ei valittua kaatajaa"
                        iconButtonName="account-plus-outline"
                        onPress={() => setShooterModalVisible(true)}
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
                    <IconTextInput
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        label="Paikka"
                        required={true}
                        inputType="default"
                        value={shotLocation}
                        onChangeText={setShotLocation}
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
                        valueState={animal}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => setAnimalModalVisible(true)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Ikäluokka"
                        valueState={age}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => setAgeModalVisible(true)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Sukupuoli"
                        valueState={gender}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => setGenderModalVisible(true)}
                    />
                    <IconTextInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="scale"
                        label="Ruhopaino"
                        required={true}
                        inputType="numeric"
                        value={weight?.toString()}
                        onChangeText={(text: string) => setWeight(Number(text))}
                    />
                    <IconTextInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="information"
                        label="Lisätietoja"
                        required={false}
                        inputType="default"
                        value={info}
                        onChangeText={setInfo}
                        multiline={true}
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
                        Käyttötiedot
                    </Text>

                    <CustomInput
                        iconSet="NoIcon"
                        title="Ensimmäinen käyttö"
                        valueState={firstUsage?.kasittely_teksti}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => setFirstUsageModalVisible(true)}
                    />
                    <View style={{ paddingLeft: 55 }}>
                        <Text variant="bodyLarge">
                            Ensimmäisen käytön osuus
                        </Text>
                        <Text style={{ color: theme.colors.outline }}>
                            {firstUsageAmount}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={firstUsageAmount}
                        onValueChange={handleFirstSliderChange}
                        step={25}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: 32,
                            paddingRight: 55,
                        }}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{ color: theme.colors.primary }}
                        >
                            Lisää toinen käyttö
                        </Text>
                        <Switch
                            value={secondUsageEnabled}
                            onValueChange={setSecondUsageEnabled}
                        />
                    </View>
                    <CustomInput
                        iconSet="NoIcon"
                        title="Toinen käyttö"
                        valueState={secondUsage?.kasittely_teksti}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => setSecondUsageModalVisible(true)}
                        enabled={secondUsageEnabled}
                    />
                    <View style={{ paddingLeft: 55, paddingTop: 20 }}>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: secondUsageEnabled
                                    ? theme.colors.onBackground
                                    : theme.colors.outline,
                            }}
                        >
                            Toisen käytön osuus
                        </Text>
                        <Text style={{ color: theme.colors.outline }}>
                            {secondUsageAmount}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        disabled={!secondUsageEnabled}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={secondUsageAmount}
                        onValueChange={handleSecondSliderChange}
                        step={25}
                    />
                </View>
            </ScrollView>
            {/* <FloatingActionButton
                scrollValue={0}
                type={"create"}
                label={"Tallenna"}
                icon={"content-save"}
                onPress={() => console.log("pressed")}
            /> */}
            {/* <Surface
                elevation={1}
                style={{
                    ...styles.bottomBar,
                    backgroundColor: theme.colors.primaryContainer,
                }}
            >
                <Button mode="elevated" style={{ flex: 1 }}>
                    Poistu
                </Button>
                <Button mode="elevated" style={{ flex: 1 }}>
                    Tallenna
                </Button>
            </Surface> */}
            {/* <Button
                mode="contained"
                style={{ bottom: 20, right: 55, position: "absolute" }}
            >
                Tallenna
            </Button> */}
        </>
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
    bottomBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        // borderTopEndRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        // marginHorizontal: 16,
        // marginBottom: 5,
        gap: 8,
    },
    slider: {
        marginTop: 16,
        marginLeft: 40,
        marginRight: 50,
        marginBottom: 50,
    },
});

export default ShotForm;
