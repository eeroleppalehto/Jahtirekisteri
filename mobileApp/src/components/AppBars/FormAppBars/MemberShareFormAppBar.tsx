import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMemberShareFromStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { MemberShareFormType } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function MemberShareFormAppBar({ navigation, route }: Props) {
    // Load form data from store
    const { membershipId, portion, shareDate, usage, amount, clearForm } =
        useMemberShareFromStore((state) => ({
            membershipId: state.jasenyys_id,
            portion: state.osnimitys,
            shareDate: state.paiva,
            usage: state.kaadon_kasittely_id,
            amount: state.maara,
            clearForm: state.clearForm,
        }));

    const mutation = useMutation<
        // Omit<MembershipFormType, "poistui">,
        MemberShareFormType,
        Error,
        MemberShareFormType,
        unknown
    >({
        mutationFn: axiosPost("member-shares"),
        onSuccess: () => {
            console.log("Mutation success");
            navigation.setParams({
                isSuccess: true,
                clearFields: false,
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

        const payload: MemberShareFormType = {
            paiva: shareDate,
            kaadon_kasittely_id: usage,
            osnimitys: portion,
            maara: calculatedWeight,
            jasenyys_id: membershipId,
        };

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää jäsenjako`} />
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
