import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useGroupFormStore } from "../../../stores/formStore";
import { axiosPost, axiosPut } from "../../../hooks/useTanStackQuery";
import {
    Group,
    GroupFormType,
    GroupViewQuery,
    PartyViewQuery,
} from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormRouteType } from "../../../NavigationTypes";

type Props = NativeStackHeaderProps;

export default function GroupFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { groupName, partyId, clearForm } = useGroupFormStore((state) => ({
        groupName: state.ryhman_nimi,
        partyId: state.seurue_id,
        clearForm: state.clearForm,
    }));

    const { method, id } = route.params as FormRouteType;

    const queryClient = useQueryClient();

    const axiosFunction = () => {
        if (method === "POST") return axiosPost("groups");
        if (method === "PUT") {
            if (!id) {
                navigation.setParams({
                    isError: true,
                    errorMessage: "ID is missing",
                });
            }
            return axiosPut(`groups/${id}`);
        }
    };

    const mutation = useMutation<Group, Error, GroupFormType, unknown>({
        mutationFn: axiosFunction(),
        onSuccess: (data) => {
            const parties = queryClient.getQueryData<PartyViewQuery[]>([
                "Parties",
            ]);

            const party = parties?.find((p) => p.seurue_id === data.seurue_id);
            queryClient.setQueryData<GroupViewQuery[]>(["Groups"], (oldList) =>
                oldList?.map((i) => {
                    if (i.ryhma_id === data.ryhma_id) {
                        return {
                            ...i,
                            seurue_id: data.seurue_id,
                            ryhman_nimi: data.ryhman_nimi,
                            seurueen_nimi: party ? party.seurueen_nimi : "",
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
        const payload = {
            ryhman_nimi: groupName,
            seurue_id: partyId,
        };

        if (payload.ryhman_nimi?.trim() === "") {
            navigation.setParams({
                isError: true,
                errorMessage: "Ryhmän nimi ei voi olla tyhjä",
            });
            return;
        }

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää ryhmä`} />
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
