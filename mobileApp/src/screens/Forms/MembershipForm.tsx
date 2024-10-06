import {
    Button,
    Portal,
    Text,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../NavigationTypes";
import BottomSheet from "@gorhom/bottom-sheet";
import { useState, useRef, useEffect } from "react";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { ShooterRadioGroup } from "../../components/RadioGroups/ShooterRadioGroup";
import { MembershipFormType } from "../../types";
import { ScrollView } from "react-native-gesture-handler";
import DatePicker from "../../components/DatePicker";
import Slider from "@react-native-community/slider";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { useMemberShipFormStore } from "../../stores/formStore";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = RootStackScreenProps<"MembershipForm">;

export function MembershipForm({ route, navigation }: Props) {
    // Bottom sheet state and ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Modal visibility states
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Label states for displaying the selected value
    const [shooter, setShooter] = useState<Shooter | undefined>(undefined);

    const membershipFormStore = useMemberShipFormStore();

    // Data from the route
    const { method, isError, isSuccess, clearFields, errorMessage } =
        route.params as {
            method: string;
            isError: boolean;
            isSuccess: boolean;
            clearFields: boolean;
            errorMessage: string;
        };

    useEffect(() => {
        if (clearFields) {
            setShooter(undefined);
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [clearFields]);

    const theme = useTheme();

    // Function for handling the change of the shooter
    const handleShooterChange = (shooter: Shooter) => {
        setShooter(shooter);
        membershipFormStore.updateMemberId(shooter.jasen_id);
        // bottomSheetRef.current?.close();
    };

    const ShooterContent = (shooter: Shooter | undefined) => {
        if (shooter) {
            return (
                <>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge">{shooter.kokonimi}</Text>
                </>
            );
        } else {
            return (
                <>
                    <MaterialIcons
                        name="person-add"
                        size={24}
                        color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge">Valitse jäsen</Text>
                </>
            );
        }
    };

    const DateContent = (dateString: string | undefined) => {
        if (dateString) {
            return (
                <>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={theme.colors.primary}
                        // onPress={() => {
                        //     setShooterId(undefined);
                        //     setShooterLabel(undefined);
                        //     setShooter(undefined);
                        // }}
                    />
                    <Text variant="bodyLarge">
                        {new Date(dateString).toLocaleString("fi-FI", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </>
            );
        } else {
            return (
                <>
                    <MaterialCommunityIcons
                        name="calendar-plus"
                        size={24}
                        color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge">Valitse päivämäärä</Text>
                </>
            );
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;
        membershipFormStore.updateJoinDate(date.toISOString());
        // navigation.setParams({
        //     data: {
        //         ...data,
        //         liittyi: date.toISOString(),
        //     },
        // });
    };

    const handleSliderChange = (value: number) => {
        membershipFormStore.updateShare(value);
        // navigation.setParams({
        //     data: {
        //         ...data,
        //         osuus: value,
        //     },
        // });
    };

    const parseDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;

        return new Date(dateString);
    };

    return (
        <>
            <ScrollView style={{ padding: 16 }}>
                <Portal>
                    <ErrorModal
                        isError={isError}
                        onDismiss={() =>
                            navigation.setParams({ isError: false })
                        }
                    />
                    <SuccessSnackbar
                        isSuccess={isSuccess}
                        onDismiss={() =>
                            navigation.setParams({ isSuccess: false })
                        }
                    />
                    <DatePicker
                        initDate={parseDate(membershipFormStore.liittyi)}
                        open={calendarOpen}
                        setOpen={setCalendarOpen}
                        setDate={handleDateChange}
                    />
                </Portal>
                <View style={{ gap: 50 }}>
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                            }}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{
                                    paddingLeft: 8,
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Jäsen
                            </Text>
                            <Text
                                variant="bodyLarge"
                                style={{
                                    color: theme.colors.error,
                                }}
                            >
                                *
                            </Text>
                        </View>
                        <TouchableRipple
                            style={{
                                backgroundColor: theme.colors.surface,
                                // borderWidth: 1,
                                // borderColor: theme.colors.surfaceVariant,
                                borderRadius: 24,
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "center",
                            }}
                            onPress={() =>
                                bottomSheetRef.current?.snapToIndex(2)
                            }
                        >
                            {ShooterContent(shooter)}
                        </TouchableRipple>
                    </View>
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                            }}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{
                                    paddingLeft: 8,
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Osuus
                            </Text>
                            <Text
                                variant="bodyLarge"
                                style={{
                                    color: theme.colors.error,
                                }}
                            >
                                *
                            </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text
                                variant="titleMedium"
                                style={{ color: theme.colors.secondary }}
                            >
                                {membershipFormStore.osuus}
                            </Text>
                        </View>
                        <Slider
                            // style={{ height: 100 }}
                            minimumValue={0}
                            maximumValue={100}
                            minimumTrackTintColor={theme.colors.primary}
                            thumbTintColor={theme.colors.primary}
                            value={membershipFormStore.osuus}
                            onValueChange={handleSliderChange}
                            step={50}
                        />
                    </View>
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                            }}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{
                                    paddingLeft: 8,
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Liittymispäivä
                            </Text>
                            <Text
                                variant="bodyLarge"
                                style={{
                                    color: theme.colors.error,
                                }}
                            >
                                *
                            </Text>
                        </View>
                        <TouchableRipple
                            style={{
                                backgroundColor: theme.colors.surface,
                                borderWidth: 1,
                                borderColor: theme.colors.surfaceVariant,
                                borderRadius: 24,
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "center",
                            }}
                            onPress={() => setCalendarOpen(true)}
                        >
                            {DateContent(membershipFormStore.liittyi)}
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>
            <BottomSheetPicker ref={bottomSheetRef}>
                <ShooterRadioGroup
                    shooterId={membershipFormStore.jasen_id}
                    onValueChange={handleShooterChange}
                />
            </BottomSheetPicker>
        </>
    );
}
