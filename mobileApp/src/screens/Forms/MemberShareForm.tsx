import { View } from "react-native";
import { Text, Portal, useTheme, TouchableRipple } from "react-native-paper";
import DatePicker from "../../components/DatePicker";
import { ScrollView } from "react-native-gesture-handler";
import { useState, useRef, useMemo, useEffect } from "react";
import { PortionRadioGroup } from "../../components/RadioGroups/PortionRadioGroup";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RootStackScreenProps } from "../../NavigationTypes";
import { PartyRadioGroup } from "../../components/RadioGroups/PartyRadioGroup";
import { MembershipRadioGroup } from "../../components/RadioGroups/MembershipRadioGroup";
import { ErrorScreen } from "../ErrorScreen";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { useMemberShareFromStore } from "../../stores/formStore";

type Membership = {
    jasenyys_id: number;
    jasenen_nimi: string;
};

type Props = RootStackScreenProps<"MemberShareForm">;

export function MemberShareForm({ route, navigation }: Props) {
    const [membership, setMembership] = useState<Membership | undefined>(
        undefined
    );
    // Modal visibility states
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [partyId, setPartyId] = useState<number | undefined>(undefined);

    const memberShareFormStore = useMemberShareFromStore();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useTheme();

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
            setMembership(undefined);
            setPartyId(undefined);
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [clearFields]);

    const DateContent = (dateString: string | undefined) => {
        if (dateString) {
            return (
                <>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={theme.colors.primary}
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

    const MembershipContent = (membership: Membership | undefined) => {
        if (membership) {
            return (
                <>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge">{membership.jasenen_nimi}</Text>
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
                    <Text variant="bodyLarge">Lisää saaja</Text>
                </>
            );
        }
    };

    const handleMembershipChange = (value: Membership) => {
        memberShareFormStore.updateMemberId(value.jasenyys_id);
        setMembership(value);
    };

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return;
        memberShareFormStore.updateShareDate(date.toISOString());
    };

    const handlePartyChange = (value: number | undefined) => {
        setPartyId(value);
        setMembership(undefined);
        memberShareFormStore.updateMemberId(undefined);
    };

    const parseDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;

        return new Date(dateString);
    };

    return (
        <>
            <ScrollView style={{ paddingTop: 8 }}>
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
                        initDate={parseDate(memberShareFormStore.paiva)}
                        open={calendarOpen}
                        setOpen={setCalendarOpen}
                        setDate={handleDateChange}
                    />
                </Portal>
                <View style={{ gap: 30 }}>
                    <View
                        style={{
                            paddingHorizontal: 16,
                            gap: 2,
                        }}
                    >
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
                                Jaon saaja
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
                        <View style={{ marginBottom: 6 }}>
                            <PartyRadioGroup
                                partyId={partyId}
                                onValueChange={handlePartyChange}
                                type={"Jäsen"}
                                title={"Valitse seurue, josta saaja valitaan"}
                            />
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
                            {MembershipContent(membership)}
                        </TouchableRipple>
                    </View>
                    <View style={{ paddingHorizontal: 16, gap: 2 }}>
                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                            <Text
                                variant="bodyLarge"
                                style={{
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Ruhonosa
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
                        <PortionRadioGroup
                            portionName={memberShareFormStore.osnimitys}
                            onValueChange={memberShareFormStore.updatePortion}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 16, gap: 2 }}>
                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                            <Text
                                variant="bodyLarge"
                                style={{
                                    fontWeight: "bold",
                                    color: theme.colors.primary,
                                }}
                            >
                                Jaon päivämäärä
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
                            {DateContent(memberShareFormStore.paiva)}
                        </TouchableRipple>
                    </View>
                    {/* <Button
                        onPress={() => {
                            // console.log(
                            //     `${
                            //         membership ? membership.jasenen_nimi : ""
                            //     } | ${data.jasenyys_id} | ${data.osnimitys} | ${
                            //         data.paiva
                            //     }`
                            // );
                            console.log(data);
                        }}
                    >
                        Test
                    </Button> */}
                </View>
                <View style={{ paddingBottom: 300 }}></View>
            </ScrollView>
            <BottomSheetPicker ref={bottomSheetRef}>
                <MembershipRadioGroup
                    membershipId={memberShareFormStore.jasenyys_id}
                    onValueChange={handleMembershipChange}
                    partyId={partyId}
                />
            </BottomSheetPicker>
        </>
    );
}
