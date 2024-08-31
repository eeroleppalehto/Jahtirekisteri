import { Text, useTheme, TextInput, Portal } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { RootStackScreenProps } from "../../NavigationTypes";
import { GroupFormType } from "../../types";
import { PartyRadioGroup } from "../../components/RadioGroups/PartyRadioGroup";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";

type navType = MaintenanceTabScreenProps<"Ryhmät">["navigation"];

type Props = RootStackScreenProps<"Forms">;

export function GroupForm({ route, navigation }: Props) {
    useEffect(() => {
        if (route.params?.clear !== false) {
            // setShooterLabel(undefined);
            navigation.setParams({
                data: {
                    seurue_id: undefined,
                    ryhman_nimi: "",
                },
            });
            navigation.setParams({ clear: false });
        }
    }, [route.params?.clear]);

    const { data, isError, isSuccess, errorMessage } = route.params as {
        data: GroupFormType;
        isError: boolean;
        isSuccess: boolean;
        errorMessage?: string;
    };

    const handlePartyChange = (value: number | undefined) => {
        navigation.setParams({
            data: {
                ...data,
                seurue_id: value,
            },
        });
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
                    paddingLeft: 16,
                    paddingTop: 20,
                }}
            >
                Ryhmän tiedot
            </Text>
            <View
                style={{
                    paddingTop: 20,
                    gap: 24,
                }}
            >
                <TextInput
                    label="Ryhmän nimi"
                    mode="outlined"
                    value={data ? data.ryhman_nimi : ""}
                    onChangeText={(text) => {
                        navigation.setParams({
                            data: {
                                ...data,
                                ryhman_nimi: text,
                            },
                        });
                    }}
                    style={{ marginHorizontal: 16, paddingVertical: 4 }}
                    outlineStyle={{
                        borderRadius: 24,
                        borderColor: theme.colors.surfaceVariant,
                    }}
                />
                <View
                    style={{
                        padding: 16,
                        gap: 6,
                    }}
                >
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                        <Text
                            variant="bodyLarge"
                            style={{
                                color: theme.colors.onBackground,
                            }}
                        >
                            Seurue
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
                    <PartyRadioGroup
                        partyId={data ? data.seurue_id : undefined}
                        onValueChange={handlePartyChange}
                        type="Ryhmä"
                    />
                </View>
            </View>
        </>
    );
}
