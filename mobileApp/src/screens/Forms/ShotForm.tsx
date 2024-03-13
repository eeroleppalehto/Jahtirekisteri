import { Portal, Text, useTheme, Divider, Switch } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";
import DatePicker from "../../components/DatePicker";
import Slider from "@react-native-community/slider";
import { RootStackScreenProps } from "../../NavigationTypes";
import { UsageForm, ShotFormType } from "../../types";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { AgeRadioGroup } from "../../components/RadioGroups/AgeRadioGroup";
import { AnimalRadioGroup } from "../../components/RadioGroups/AnimalRadioGroup";
import { GenderRadioGroup } from "../../components/RadioGroups/GenderRadioGroup";
import { ShooterRadioGroup } from "../../components/RadioGroups/ShooterRadioGroup";
import { UsageRadioGroup } from "../../components/RadioGroups/UsageRadioGroup";
import BottomSheet from "@gorhom/bottom-sheet";

type Props = RootStackScreenProps<"Forms">;

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

    const theme = useTheme();

    // Initialize the form with empty values and set it to route params
    useEffect(() => {
        // TODO: Make this into a custom hook that returns the params
        // TODO: See if it's possible check params already has shot and usage
        // and if it does, skip this part to keep the old state
        if (route.params?.clear === true) {
            setShooterLabel(undefined);
            setFirstUsageLabel(undefined);
            setSecondUsageLabel(undefined);
            navigation.setParams({
                shot: {
                    jasen_id: undefined,
                    kaatopaiva: undefined,
                    ruhopaino: 0,
                    paikka_teksti: "",
                    elaimen_nimi: undefined,
                    sukupuoli: undefined,
                    ikaluokka: undefined,
                    lisatieto: "",
                },
                usage: [
                    {
                        kasittelyid: undefined,
                        kasittely_maara: 100,
                    },
                    {
                        kasittelyid: undefined,
                        kasittely_maara: 0,
                    },
                ],
            });
            navigation.setParams({ clear: false });
        }
    }, [route.params?.clear]);

    const handleBottomSheetOpen = (
        content: BottomSheetContent,
        index: number
    ) => {
        // bottomSheetRef.current?.expand();
        bottomSheetRef.current?.snapToIndex(index);
        setBottomSheetContent(content);
    };

    // Read the params from route
    const { shot, usage } = route.params as {
        shot: ShotFormType;
        usage: UsageForm[];
    };

    // Callback functions for updating the params
    const handleShooterChange = (shooter: Shooter) => {
        setShooterLabel(shooter.kokonimi);
        navigation.setParams({
            shot: { ...shot, jasen_id: shooter.jasen_id },
        });
    };

    const handleShotDateChange = (date: Date | undefined) => {
        if (date === undefined) return;
        navigation.setParams({
            shot: { ...shot, kaatopaiva: date.toISOString() },
        });
    };

    const handleShotLocationChange = (location: string) => {
        navigation.setParams({
            shot: { ...shot, paikka_teksti: location },
        });
    };

    const handleAnimalChange = (animal: string) => {
        navigation.setParams({
            shot: { ...shot, elaimen_nimi: animal },
        });
    };

    const handleAgeChange = (age: string) => {
        navigation.setParams({
            shot: { ...shot, ikaluokka: age },
        });
    };

    const handleGenderChange = (gender: string) => {
        navigation.setParams({
            shot: { ...shot, sukupuoli: gender },
        });
    };

    const handleWeightChange = (weight: string) => {
        navigation.setParams({
            shot: { ...shot, ruhopaino: Number(weight) },
        });
    };

    const handleInfoChange = (info: string) => {
        navigation.setParams({
            shot: { ...shot, lisatieto: info },
        });
    };

    const handleFirstUsageChange = (obj: Usage | undefined) => {
        if (obj === undefined) return;
        setFirstUsageLabel(obj.kasittely_teksti);
        navigation.setParams({
            usage: [{ ...usage[0], kasittelyid: obj.kasittelyid }, usage[1]],
        });
    };

    const handleSecondUsageChange = (obj: Usage | undefined) => {
        if (obj === undefined) return;
        setSecondUsageLabel(obj.kasittely_teksti);
        navigation.setParams({
            usage: [usage[0], { ...usage[1], kasittelyid: obj.kasittelyid }],
        });
    };

    const handleFirstSliderChange = (value: number) => {
        navigation.setParams({
            usage: [
                { ...usage[0], kasittely_maara: value },
                { ...usage[1], kasittely_maara: 100 - value },
            ],
        });
    };

    const handleSecondSliderChange = (value: number) => {
        navigation.setParams({
            usage: [
                { ...usage[0], kasittely_maara: 100 - value },
                { ...usage[1], kasittely_maara: value },
            ],
        });
    };

    const handleSecondUsageToggle = (value: boolean) => {
        setSecondUsageEnabled(value);
        if (value === false) {
            setSecondUsageLabel(undefined);
            navigation.setParams({
                usage: [
                    { ...usage[0], kasittely_maara: 100 },
                    { kasittelyid: undefined, kasittely_maara: 0 },
                ],
            });
        }
    };

    const BottomSheetContent = () => {
        switch (bottomSheetContent) {
            case "shooter":
                return (
                    <ShooterRadioGroup
                        shooterId={shot ? shot.jasen_id : undefined}
                        onValueChange={handleShooterChange}
                    />
                );
            case "age":
                return (
                    <AgeRadioGroup
                        age={shot ? shot.ikaluokka : undefined}
                        onValueChange={handleAgeChange}
                    />
                );
            case "animal":
                return (
                    <AnimalRadioGroup
                        animal={shot ? shot.elaimen_nimi : undefined}
                        onValueChange={handleAnimalChange}
                    />
                );
            case "gender":
                return (
                    <GenderRadioGroup
                        gender={shot ? shot.sukupuoli : undefined}
                        onValueChange={handleGenderChange}
                    />
                );
            case "usage1":
                return (
                    <UsageRadioGroup
                        usageForm={usage ? usage[0] : undefined}
                        onValueChange={handleFirstUsageChange}
                    />
                );
            case "usage2":
                return (
                    <UsageRadioGroup
                        usageForm={usage ? usage[1] : undefined}
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
                <DatePicker
                    initDate={
                        shot
                            ? shot.kaatopaiva
                                ? new Date(shot.kaatopaiva)
                                : undefined
                            : undefined
                    }
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
                            shot
                                ? shot.kaatopaiva
                                    ? new Date(
                                          shot.kaatopaiva
                                      ).toLocaleDateString("fi-FI") // TODO: This stinks!!!
                                    : undefined
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
                        value={shot ? shot.paikka_teksti : undefined}
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
                        valueState={shot ? shot.elaimen_nimi : undefined}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("animal", 0)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Ikäluokka"
                        valueState={shot ? shot.ikaluokka : undefined}
                        required={true}
                        iconButtonName="plus"
                        onPress={() => handleBottomSheetOpen("age", 0)}
                    />
                    <CustomInput
                        iconSet="NoIcon"
                        title="Sukupuoli"
                        valueState={shot ? shot.sukupuoli : undefined}
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
                        value={
                            //TODO: This stinks!!!
                            shot
                                ? shot.ruhopaino
                                    ? shot.ruhopaino.toString()
                                    : ""
                                : ""
                        }
                        onChangeText={handleWeightChange}
                    />
                    <IconTextInput
                        iconSet="MaterialCommunityIcons"
                        iconNameMaterialCommunity="information"
                        label="Lisätietoja"
                        required={false}
                        inputType="default"
                        value={shot ? shot.lisatieto : undefined}
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
                            {usage ? usage[0].kasittely_maara : 100}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={usage ? usage[0].kasittely_maara : 100}
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
                            {usage ? usage[1].kasittely_maara : 0}
                        </Text>
                    </View>
                    <Slider
                        style={{ ...styles.slider }}
                        disabled={!secondUsageEnabled}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={theme.colors.primary}
                        thumbTintColor={theme.colors.primary}
                        value={usage ? usage[1].kasittely_maara : 0}
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
