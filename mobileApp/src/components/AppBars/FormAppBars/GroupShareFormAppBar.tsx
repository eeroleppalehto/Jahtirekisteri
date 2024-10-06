import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useGroupShareFormStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { GroupShareFormType } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function GroupShareFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { groupId, portion, amount, usage, shareDate, clearForm } =
        useGroupShareFormStore((state) => ({
            groupId: state.ryhma_id,
            portion: state.osnimitys,
            amount: state.maara,
            usage: state.kaadon_kasittely_id,
            shareDate: state.paiva,
            clearForm: state.clearForm,
        }));

    const mutation = useMutation<
        GroupShareFormType,
        Error,
        GroupShareFormType,
        unknown
    >({
        mutationFn: axiosPost("shares"),
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
        const portionMap = new Map<string, number>([
            ["Koko", 1],
            ["Puolikas", 0.5],
            ["Neljännes", 0.25],
        ]);

        if (!portion || !amount) {
            navigation.setParams({
                isError: true,
                errorMessage: "Puutteelliset tiedot",
            });
            return;
        }

        const portionMultiplier = portionMap.get(portion) ?? 0;

        const calculatedWeight = amount * portionMultiplier;

        const payload: GroupShareFormType = {
            ryhma_id: groupId,
            maara: calculatedWeight,
            paiva: shareDate,
            osnimitys: portion,
            kaadon_kasittely_id: usage,
        };

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää ryhmäjako`} />
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
