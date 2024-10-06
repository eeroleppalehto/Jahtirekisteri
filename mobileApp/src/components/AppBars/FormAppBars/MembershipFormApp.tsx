import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMemberShipFormStore } from "../../../stores/formStore";
import { axiosPost } from "../../../hooks/useTanStackQuery";
import { MembershipFormType } from "../../../types";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackHeaderProps;

export default function MembershipFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const { memberId, partyId, groupId, share, joinDate, clearForm } =
        useMemberShipFormStore((state) => ({
            memberId: state.jasen_id,
            partyId: state.seurue_id,
            groupId: state.ryhma_id,
            share: state.osuus,
            joinDate: state.liittyi,
            clearForm: state.clearForm,
        }));

    const mutation = useMutation<
        // Omit<MembershipFormType, "poistui">,
        MembershipFormType,
        Error,
        Partial<Omit<MembershipFormType, "poistui">>,
        unknown
    >({
        mutationFn: axiosPost("memberships"),
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
            jasen_id: memberId,
            seurue_id: partyId,
            ryhma_id: groupId,
            osuus: share,
            liittyi: joinDate,
        };

        if (!payload.ryhma_id) {
            delete payload.ryhma_id;
        }

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää jäsenyys`} />
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
