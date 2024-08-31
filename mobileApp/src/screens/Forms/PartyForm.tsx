import {
    Text,
    useTheme,
    TouchableRipple,
    TextInput,
    Button,
    Portal,
} from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { RootStackScreenProps } from "../../NavigationTypes";
import { PartyTypesRadioGroup } from "../../components/RadioGroups/PartyTypesRadioGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { ShooterRadioGroup } from "../../components/RadioGroups/ShooterRadioGroup";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { PartyFormType, PartyType } from "../../types";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type navType = MaintenanceTabScreenProps<"Seurueet">["navigation"];

type Props = RootStackScreenProps<"Forms">;

export function PartyForm({ route, navigation }: Props) {
    const [shooter, setShooter] = useState<Shooter | undefined>(undefined);

    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (route.params?.clear !== false) {
            navigation.setParams({
                data: {
                    seurueen_nimi: "",
                    seura_id: 1,
                    seurue_tyyppi_id: undefined,
                    jasen_id: undefined,
                },
            });
            navigation.setParams({ clear: false });
        }
    }, [route.params?.clear]);

    const { data, isError, isSuccess, errorMessage } = route.params as {
        data: PartyFormType;
        isError: boolean;
        isSuccess: boolean;
        errorMessage?: string;
    };

    const handleShooterChange = (shooter: Shooter) => {
        // setShooterId(shooter.jasen_id);
        setShooter(shooter);
        navigation.setParams({
            data: {
                ...data,
                jasen_id: shooter.jasen_id,
            },
        });
        bottomSheetRef.current?.close();
    };

    const handlePartyTypeChange = (partyType: PartyType) => {
        navigation.setParams({
            data: {
                ...data,
                seurue_tyyppi_id: partyType.seurue_tyyppi_id,
            },
        });
    };

    const ShooterContent = (shooter: Shooter | undefined) => {
        if (shooter) {
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
                    <Text variant="bodyLarge">Lisää seurueenjohtaja</Text>
                </>
            );
        }
    };

    const theme = useTheme();

    return (
        <>
            <Portal>
                <ErrorModal
                    isError={isError}
                    onDismiss={() =>
                        navigation.setParams({
                            isError: false,
                            errorMessage: undefined,
                        })
                    }
                    message={errorMessage}
                />
                <SuccessSnackbar
                    isSuccess={isSuccess}
                    onDismiss={() => navigation.setParams({ isSuccess: false })}
                />
            </Portal>
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 10,
                    paddingVertical: 20,
                }}
            >
                Seurueen tiedot
            </Text>
            <View style={{ gap: 30 }}>
                <TextInput
                    label="Seurueen nimi"
                    mode="outlined"
                    style={{ marginHorizontal: 16, paddingVertical: 4 }}
                    outlineStyle={{
                        borderRadius: 24,
                        borderColor: theme.colors.surfaceVariant,
                    }}
                    value={data ? data.seurueen_nimi : ""}
                    placeholder="Lisää nimi"
                    onChangeText={(text) =>
                        navigation.setParams({
                            data: {
                                ...data,
                                seurueen_nimi: text,
                            },
                        })
                    }
                />
                <View style={{ paddingHorizontal: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            // gap: 4,
                            alignItems: "flex-start",
                        }}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{ paddingLeft: 8, paddingBottom: 4 }}
                        >
                            Seurueen Tyyppi
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                color: theme.colors.error,
                            }}
                        >
                            *
                        </Text>
                    </View>
                    <PartyTypesRadioGroup
                        partyTypeId={data ? data.seurue_tyyppi_id : undefined}
                        onValueChange={handlePartyTypeChange}
                    />
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            // gap: 4,
                            alignItems: "flex-start",
                        }}
                    >
                        <Text
                            variant="bodyLarge"
                            style={{ paddingLeft: 8, paddingBottom: 4 }}
                        >
                            Seurueenjohtaja
                        </Text>
                        <Text
                            variant="bodyMedium"
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
                        onPress={() => bottomSheetRef.current?.snapToIndex(2)}
                    >
                        {ShooterContent(shooter)}
                    </TouchableRipple>
                </View>
            </View>
            <BottomSheetPicker ref={bottomSheetRef}>
                <ShooterRadioGroup
                    shooterId={data ? data.jasen_id : undefined}
                    onValueChange={handleShooterChange}
                />
            </BottomSheetPicker>
        </>
    );
}
