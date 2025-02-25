import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { usePartyFormStore } from "../../../stores/formStore";
import { axiosPost, axiosPut } from "../../../hooks/useTanStackQuery";
import {
    Party,
    PartyFormType,
    PartyType,
    PartyViewQuery,
} from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormRouteType } from "../../../NavigationTypes";

type Props = NativeStackHeaderProps;

export default function PartyFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const {
        partyName,
        partyLeaderId,
        partyLeaderName,
        partyTypeId,
        clearForm,
    } = usePartyFormStore((state) => ({
        partyName: state.seurueen_nimi,
        partyLeaderId: state.jasen_id,
        partyLeaderName: state.kokonimi,
        partyTypeId: state.seurue_tyyppi_id,
        clearForm: state.clearForm,
    }));

    const { method, id } = route.params as FormRouteType;

    const queryClient = useQueryClient();

    const axiosFunction = () => {
        if (method === "POST") return axiosPost("parties");
        if (method === "PUT") {
            if (!id) {
                navigation.setParams({
                    isError: true,
                    errorMessage: "ID is missing",
                });
            }
            return axiosPut(`parties/${id}`);
        }
    };

    const mutation = useMutation<Party, Error, PartyFormType, unknown>({
        mutationFn: axiosFunction(),
        onSuccess: (data) => {
            queryClient.setQueryData<PartyViewQuery[]>(["Parties"], (oldList) =>
                oldList?.map((i) => {
                    if (i.seurue_id === data.seurue_id) {
                        return {
                            ...i,
                            seurueen_nimi: data.seurueen_nimi,
                            jasen_id: data.jasen_id,
                            seurueen_johatajan_nimi: partyLeaderName
                                ? partyLeaderName
                                : "",
                        };
                    }

                    return i;
                })
            );

            if (method === "PUT") {
                navigation.goBack();
            } else {
                console.log("Mutation success");
                navigation.setParams({
                    isSuccess: true,
                    clearFields: true,
                });
                clearForm();
            }
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
