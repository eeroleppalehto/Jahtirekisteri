import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useGroupFormStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { GroupFormType } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function GroupFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { groupName, partyId, clearForm } = useGroupFormStore((state) => ({
        groupName: state.ryhman_nimi,
        partyId: state.seurue_id,
        clearForm: state.clearForm,
    }));

    const mutation = useMutation<GroupFormType, Error, GroupFormType, unknown>({
        mutationFn: axiosPost("groups"),
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
