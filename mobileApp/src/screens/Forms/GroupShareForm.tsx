import { View } from "react-native";
import {
    Text,
    Portal,
    useTheme,
    TouchableRipple,
    Button,
} from "react-native-paper";
import DatePicker from "../../components/DatePicker";
import { ScrollView } from "react-native-gesture-handler";
import { useState, useRef, useMemo } from "react";
import { PortionRadioGroup } from "../../components/RadioGroups/PortionRadioGroup";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RootStackScreenProps } from "../../NavigationTypes";
import { GroupShareFormType } from "../../types";
import { PartyRadioGroup } from "../../components/RadioGroups/PartyRadioGroup";
import { GroupRadioGroup } from "../../components/RadioGroups/GroupRadioGroup";
import { ErrorScreen } from "../ErrorScreen";

type Group = {
    ryhma_id: number;
    ryhman_nimi: string;
};

type Props = RootStackScreenProps<"Forms">;

export function GroupShareForm({ route, navigation }: Props) {
    const theme = useTheme();
    const [group, setGroup] = useState<Group | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [partyId, setPartyId] = useState<number | undefined>(undefined);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const { data } = route.params as {
        data: GroupShareFormType;
    };

    const parseWeight = (data: GroupShareFormType | undefined) => {
        if (!data) return undefined;

        if (!data.maara) return undefined;

        return data.maara;
    };

    const initWeight = useMemo(() => parseWeight(data), []);

    if (!data) {
        return (
            <ErrorScreen
                error={new Error("Virhe navigoinnissa. Yritä uudelleen.")}
                reload={() => {}}
            />
        );
    }

    if (!initWeight) {
        return (
            <ErrorScreen
                error={new Error("Virhe navigoinnissa. Yritä uudelleen.")}
                reload={() => {}}
            />
        );
    }

    const GroupContent = (group: Group | undefined) => {
        if (group) {
            return (
                <>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge">{group.ryhman_nimi}</Text>
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
        navigation.setParams({
            data: {
                ...data,
                paiva: date.toISOString(),
            },
        });
    };

    const handlePortionChange = (value: string) => {
        const portionMap = new Map<string, number>([
            ["Koko", 1],
            ["Puolikas", 0.5],
            ["Neljännes", 0.25],
        ]);

        const portionNumber = portionMap.get(value) ?? 0;

        const weight = initWeight * portionNumber;

        navigation.setParams({
            data: {
                ...data,
                osnimitys: value,
                maara: weight,
            },
        });
    };

    const handlePartyChange = (value: number | undefined) => {
        setPartyId(value);
        setGroup(undefined);
        navigation.setParams({
            data: {
                ...data,
                ryhma_id: undefined,
            },
        });
    };

    const parseDate = (data: GroupShareFormType | undefined) => {
        if (!data) return undefined;

        if (!data.paiva) return undefined;

        return new Date(data.paiva);
    };

    const parsePortion = (data: GroupShareFormType | undefined) => {
        if (!data) return undefined;

        if (!data.osnimitys) return undefined;

        return data.osnimitys;
    };

    return (
        <>
            <ScrollView style={{ paddingTop: 8 }}>
                <Portal>
                    <DatePicker
                        initDate={parseDate(data)}
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
                                type={"Ryhmä"}
                                title={"Rajaa ryhmät seurueen mukaan"}
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
                            {GroupContent(group)}
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
                            portionName={parsePortion(data)}
                            onValueChange={handlePortionChange}
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
                            {DateContent(data ? data.paiva : undefined)}
                        </TouchableRipple>
                    </View>
                    {/* <Button onPress={() => console.log(data)}>Test</Button> */}
                </View>
            </ScrollView>
            <BottomSheetPicker ref={bottomSheetRef}>
                <GroupRadioGroup
                    groupId={group?.ryhma_id}
                    onValueChange={(value) => {
                        setGroup(value);
                        navigation.setParams({
                            data: {
                                ...data,
                                ryhma_id: value.ryhma_id,
                            },
                        });
                    }}
                    partyId={partyId}
                />
            </BottomSheetPicker>
        </>
    );
}
