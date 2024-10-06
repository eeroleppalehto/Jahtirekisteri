import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { usePartyFormStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { PartyFormType } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function PartyFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { partyName, partyLeaderId, partyTypeId, clearForm } =
        usePartyFormStore((state) => ({
            partyName: state.seurueen_nimi,
            partyLeaderId: state.jasen_id,
            partyTypeId: state.seurue_tyyppi_id,
            clearForm: state.clearForm,
        }));

    const mutation = useMutation<PartyFormType, Error, PartyFormType, unknown>({
        mutationFn: axiosPost("parties"),
        onSuccess: () => {
            console.log("Mutation success");
            navigation.setParams({
                isSuccess: true,
                clearFields: true,
            });
            clearForm();
        },
    });

    const theme = useTheme();

    const handleSave = () => {
        const payload: PartyFormType = {
            seurueen_nimi: partyName,
            seura_id: 1,
            jasen_id: partyLeaderId,
            seurue_tyyppi_id: partyTypeId,
        };

        if (payload.seurueen_nimi?.trim() === "") {
            navigation.setParams({
                isError: true,
                errorMessage: "Seurueen nimi ei voi olla tyhjä",
            });
            return;
        }

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää seurue`} />
            <Button
                icon={() => (
                    <MaterialIcons
                        name="cloud-upload"
                        size={24}
                        color={theme.colors.onPrimary}
                    />
                )}
                loading={mutation.isPending}
                disabled={mutation.isPending}
                mode="contained-tonal"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                style={{ marginRight: 12 }}
                contentStyle={{ flexDirection: "row-reverse", padding: 4 }}
                labelStyle={{ fontSize: 16 }}
                onPress={() => handleSave()}
            >
                Tallenna
            </Button>
        </Appbar.Header>
    );
}
