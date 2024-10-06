import { Portal, Text, useTheme, Divider, Switch } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";
import DatePicker from "../../components/DatePicker";
import Slider from "@react-native-community/slider";
import { RootStackScreenProps } from "../../NavigationTypes";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { AgeRadioGroup } from "../../components/RadioGroups/AgeRadioGroup";
import { AnimalRadioGroup } from "../../components/RadioGroups/AnimalRadioGroup";
import { GenderRadioGroup } from "../../components/RadioGroups/GenderRadioGroup";
import { ShooterRadioGroup } from "../../components/RadioGroups/ShooterRadioGroup";
import { UsageRadioGroup } from "../../components/RadioGroups/UsageRadioGroup";
import BottomSheet from "@gorhom/bottom-sheet";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { useShotFormStore } from "../../stores/formStore";

type Props = RootStackScreenProps<"ShotForm">;

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Usage = {
    kasittelyid: number;
    kasittely_teksti: string;
};

type BottomSheetContent =
    | "shooter"
    | "age"
    | "animal"
    | "gender"
    | "usage1"
    | "usage2"
    | "none";

// Form for adding a new shot and usages for it
function ShotForm({ route, navigation }: Props) {
    // Modal visibility states
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Bottom sheet state and ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [bottomSheetContent, setBottomSheetContent] =
        useState<BottomSheetContent>("none");

    // Second usage toggle state
    const [secondUsageEnabled, setSecondUsageEnabled] =
        useState<boolean>(false);

    // Label states for displaying the selected value
    const [shooterLabel, setShooterLabel] = useState<string | undefined>(
        undefined
    );
    const [firstUsageLabel, setFirstUsageLabel] = useState<string | undefined>(
        undefined
    );
    const [secondUsageLabel, setSecondUsageLabel] = useState<
        string | undefined
    >(undefined);

    const shotFormStore = useShotFormStore();

    const theme = useTheme();

    // Read the params from route
    const { method, isError, clearFields, isSuccess, errorMessage } =
        route.params as {
            method: string;
            isError: boolean;
            isSuccess: boolean;
            clearFields: boolean;
            errorMessage: string;
        };

    useEffect(() => {
        if (route.params?.method === "POST") {
            shotFormStore.clearForm();
        }
    }, []);

    useEffect(() => {
        // Clear lable states after a succesful save
        if (clearFields) {
            setShooterLabel(undefined);
            setFirstUsageLabel(undefined);
            setSecondUsageLabel(undefined);
            setSecondUsageEnabled(false);
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [clearFields]);

    const handleBottomSheetOpen = (
        content: BottomSheetContent,
        index: number
    ) => {
        // bottomSheetRef.current?.expand();
        bottomSheetRef.current?.snapToIndex(index);
        setBottomSheetContent(content);
    };

    // Callback functions for updating the params
    const handleShooterChange = (shooter: Shooter) => {
        setShooterLabel(shooter.kokonimi);
        shotFormStore.updateShooterId(shooter.jasen_id);
    };

    const handleShotDateChange = (date: Date | undefined) => {
        if (date === undefined) return;
        shotFormStore.updateShotDate(date.toISOString());
    };

    const handleShotLocationChange = (location: string) => {
        shotFormStore.updateLocationText(location);
    };

    const handleAnimalChange = (animal: string) => {
        shotFormStore.updateAnimal(animal);
    };

    const handleAgeChange = (age: string) => {
        shotFormStore.updateAgeGroup(age);
    };

    const handleGenderChange = (gender: string) => {
        shotFormStore.updateGender(gender);
    };

    const handleWeightChange = (weight: string) => {
        shotFormStore.updateWeight(Number(weight));
    };

    const handleInfoChange = (info: string) => {
        shotFormStore.updateInfo(info);
    };

    const handleFirstUsageChange = (obj: Usage | undefined) => {
        if (obj === undefined) return;
        setFirstUsageLabel(obj.kasittely_teksti);
        shotFormStore.updateFirstUsage(obj.kasittelyid);
    };

    const handleSecondUsageChange = (obj: Usage | undefined) => {
        if (obj === undefined) return;
        setSecondUsageLabel(obj.kasittely_teksti);
        shotFormStore.updateSecondUsage(obj.kasittelyid);
    };

    const handleFirstSliderChange = (value: number) => {
        shotFormStore.updateFirstUsageAmount(value);
    };

    const handleSecondSliderChange = (value: number) => {
        shotFormStore.updateSecondUsageAmount(value);
    };

    const handleSecondUsageToggle = (value: boolean) => {
        setSecondUsageEnabled(value);
        if (value === false) {
            setSecondUsageLabel(undefined);
            shotFormStore.resetSecondUsage();
        }
    };

    const parseDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;

        return new Date(dateString);
    };

    const BottomSheetContent = () => {
        switch (bottomSheetContent) {
            case "shooter":
                return (
                    <ShooterRadioGroup
                        shooterId={shotFormStore.shot.jasen_id}
                        onValueChange={handleShooterChange}
                    />
                );
            case "age":
                return (
                    <AgeRadioGroup
                        age={shotFormStore.shot.ikaluokka}
                        onValueChange={handleAgeChange}
                    />
                );
            case "animal":
                return (
                    <AnimalRadioGroup
                        animal={shotFormStore.shot.elaimen_nimi}
                        onValueChange={handleAnimalChange}
                    />
                );
            case "gender":
                return (
                    <GenderRadioGroup
                        gender={shotFormStore.shot.sukupuoli}
                        onValueChange={handleGenderChange}
                    />
                );
            case "usage1":
                return (
                    <UsageRadioGroup
                        usageForm={shotFormStore.usages[0]}
                        onValueChange={handleFirstUsageChange}
                    />
                );
            case "usage2":
                return (
                    <UsageRadioGroup
                        usageForm={shotFormStore.usages[1]}
                        onValueChange={handleSecondUsageChange}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <>
            <Portal>
                <ErrorModal
                    isError={isError}
                    onDismiss={() => navigation.setParams({ isError: false })}
                />
                <SuccessSnackbar
                    isSuccess={isSuccess}
                    onDismiss={() => navigation.setParams({ isSuccess: false })}
                />
                <DatePicker
                    initDate={parseDate(shotFormStore.shot.kaatopaiva)}
                    setDate={handleShotDateChange}
                    open={calendarOpen}
                    setOpen={setCalendarOpen}
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
                        valueState={shooterLabel}
                        placeholder="Ei valittua kaatajaa"
                        iconButtonName="account-plus-outline"
                        onPress={() => handleBottomSheetOpen("shooter", 2)}
                    />

                    <CustomInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="calendar"
                        title="Kaatopäivä"
                        required={true}
                        valueState={
                            shotFormStore.shot.kaatopaiva
                                ? new Date(
                                      shotFormStore.shot.kaatopaiva
                                  ).toLocaleDateString("fi-FI")
                                : undefined
                        }
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
                        value={shotFormStore.shot.paikka_teksti}
                        onChangeText={handleShotLocationChange}
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
                        valueState={shotFormStore.shot.elaimen_nimi}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("animal", 0)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Ikäluokka"
                        valueState={shotFormStore.shot.ikaluokka}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("age", 0)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Sukupuoli"
                        valueState={shotFormStore.shot.sukupuoli}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("gender", 0)}
                    />
                    <IconTextInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="scale"
                        label="Ruhopaino"
                        required={true}
                        inputType="numeric"
                        value={shotFormStore.shot.ruhopaino?.toString()}
                        onChangeText={handleWeightChange}
                    />
                    <IconTextInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="information"
                        label="Lisätietoja"
                        required={false}
                        inputType="default"
                        value={shotFormStore.shot.lisatieto}
                        onChangeText={handleInfoChange}
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
                        valueState={firstUsageLabel}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("usage1", 1)}
                    />
                    <View style={{ paddingLeft: 55 }}>
                        <Text variant="bodyLarge">
                            Ensimmäisen käytön osuus
                        </Text>
                        <Text style={{ color: theme.colors.outline }}>
                            {shotFormStore.usages[0].kasittely_maara}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={shotFormStore.usages[0].kasittely_maara}
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
                            onValueChange={handleSecondUsageToggle}
                        />
                    </View>
                    <CustomInput
                        iconSet="NoIcon"
                        title="Toinen käyttö"
                        valueState={secondUsageLabel}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("usage2", 1)}
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
                            {shotFormStore.usages[1].kasittely_maara}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        disabled={!secondUsageEnabled}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={shotFormStore.usages[1].kasittely_maara}
                        onValueChange={handleSecondSliderChange}
                        step={25}
                    />
                </View>
            </ScrollView>
            <BottomSheetPicker ref={bottomSheetRef}>
                {BottomSheetContent()}
            </BottomSheetPicker>
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
