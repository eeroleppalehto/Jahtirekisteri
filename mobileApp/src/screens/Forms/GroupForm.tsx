import { Text, useTheme, TextInput, Portal } from "react-native-paper";
import { useEffect } from "react";
import { View } from "react-native";
import { RootStackScreenProps } from "../../NavigationTypes";
import { PartyRadioGroup } from "../../components/RadioGroups/PartyRadioGroup";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { useGroupFormStore } from "../../stores/formStore";

type Props = RootStackScreenProps<"GroupForm">;

export function GroupForm({ route, navigation }: Props) {
    // Load form data from the store
    const { groupName, partyId, updateGroupName, updatePartyId, clearForm } =
        useGroupFormStore((state) => ({
            groupName: state.ryhman_nimi,
            partyId: state.seurue_id,
            updateGroupName: state.updateGroupName,
            updatePartyId: state.updatePartyId,
            clearForm: state.clearForm,
        }));

    const { method, isError, isSuccess, clearFields, errorMessage } =
        route.params as {
            method: string;
            isError: boolean;
            isSuccess: boolean;
            clearFields: boolean;
            errorMessage?: string;
        };

    useEffect(() => {
        if (route.params?.method === "POST") {
            clearForm();
        }
    }, []);

    useEffect(() => {
        if (clearFields) {
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [clearFields]);

    const handlePartyChange = (value: number | undefined) => {
        updatePartyId(value);
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
                    value={groupName}
                    onChangeText={(text) => {
                        updateGroupName(text);
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
                        partyId={partyId}
                        onValueChange={handlePartyChange}
                        type="Ryhmä"
                    />
                </View>
            </View>
        </>
    );
}
