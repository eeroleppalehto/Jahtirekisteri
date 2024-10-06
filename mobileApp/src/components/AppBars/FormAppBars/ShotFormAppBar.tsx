import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useShotFormStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { ShotUsageForm } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function ShotFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { shot, usages, clearForm } = useShotFormStore((state) => ({
        shot: state.shot,
        usages: state.usages,
        clearForm: state.clearForm,
    }));

    const mutation = useMutation<ShotUsageForm, Error, ShotUsageForm, unknown>({
        mutationFn: axiosPost("shot-with-usages"),
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
            shot: { ...shot },
            usages: [...usages],
        };

        if (payload.shot?.paikka_teksti?.trim() === "") {
            navigation.setParams({
                isError: true,
                errorMessage: "Paikka tietue ei voi olla tyhjä",
            });
            return;
        }

        payload.usages = payload.usages.filter(
            (item) => item.kasittelyid !== undefined
        );

        if (payload.shot?.lisatieto?.trim() === "") {
            delete payload.shot.lisatieto;
        }

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää kaato`} />
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
