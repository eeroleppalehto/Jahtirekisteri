import {
    Text,
    useTheme,
    TouchableRipple,
    TextInput,
    Portal,
} from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RootStackScreenProps } from "../../NavigationTypes";
import { PartyTypesRadioGroup } from "../../components/RadioGroups/PartyTypesRadioGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { ShooterRadioGroup } from "../../components/RadioGroups/ShooterRadioGroup";
import { BottomSheetPicker } from "../../components/BottomSheetPicker";
import { PartyType } from "../../types";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { usePartyFormStore } from "../../stores/formStore";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = RootStackScreenProps<"PartyForm">;

export function PartyForm({ route, navigation }: Props) {
    //const [shooter, setShooter] = useState<Shooter | undefined>(undefined);

    const { method, isError, isSuccess, clearFields, errorMessage } =
        route.params;

    // Load form data from the store
    const {
        partyName,
        partyLeaderId,
        partyLeaderName,
        partyTypeId,
        updatePartyName,
        updatePartyLeader,
        updatePartyType,
        updatePartyLeaderName,
        clearForm,
    } = usePartyFormStore((state) => ({
        partyName: state.seurueen_nimi,
        partyLeaderId: state.jasen_id,
        partyLeaderName: state.kokonimi,
        partyTypeId: state.seurue_tyyppi_id,
        updatePartyName: state.updatePartyName,
        updatePartyLeader: state.updatePartyLeader,
        updatePartyType: state.updatePartyType,
        updatePartyLeaderName: state.updatePartyLeaderName,
        clearForm: state.clearForm,
    }));

    const getShooter = () => {
        if (!partyLeaderId) return undefined;
        if (!partyLeaderName) return undefined;

        const shooter: Shooter = {
            jasen_id: partyLeaderId,
            kokonimi: partyLeaderName,
        };
        return shooter;
    };

    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (method === "POST") {
            clearForm();
        }
    }, []);

    useEffect(() => {
        if (clearFields) {
            updatePartyLeader(undefined);
            updatePartyLeaderName(undefined);
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [clearFields]);

    const handleShooterChange = (shooter: Shooter) => {
        updatePartyLeader(shooter.jasen_id);
        updatePartyLeaderName(shooter.kokonimi);
        bottomSheetRef.current?.close();
    };

    const handlePartyTypeChange = (partyType: PartyType) => {
        updatePartyType(partyType.seurue_tyyppi_id);
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
                    value={partyName}
                    placeholder="Lisää nimi"
                    onChangeText={(text) => updatePartyName(text)}
                />
                {method === "POST" ? (
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
                            partyTypeId={partyTypeId}
                            onValueChange={handlePartyTypeChange}
                        />
                    </View>
                ) : null}
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
                        {ShooterContent(getShooter())}
                    </TouchableRipple>
                </View>
            </View>
            <BottomSheetPicker ref={bottomSheetRef}>
                <ShooterRadioGroup
                    shooterId={partyLeaderId}
                    onValueChange={handleShooterChange}
                />
            </BottomSheetPicker>
        </>
    );
}
