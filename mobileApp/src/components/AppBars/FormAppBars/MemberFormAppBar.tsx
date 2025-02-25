import { Appbar, Button, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMemberFormStore } from "../../../stores/formStore";
import { axiosPost, axiosPut } from "../../../hooks/useTanStackQuery";
import { JasenForm, Jasen, JasenStateQuery } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormRouteType } from "../../../NavigationTypes";

type Props = NativeStackHeaderProps;

export default function MemberFormAppBar({ navigation, route }: Props) {
    // Load form data from the store
    const {
        firstName,
        lastName,
        address,
        zipCode,
        city,
        phoneNumber,
        memberState,
        clearForm,
    } = useMemberFormStore((state) => ({
        firstName: state.etunimi,
        lastName: state.sukunimi,
        address: state.jakeluosoite,
        zipCode: state.postinumero,
        city: state.postitoimipaikka,
        phoneNumber: state.puhelinnumero,
        memberState: state.tila,
        clearForm: state.clearForm,
    }));

    const { method, id } = route.params as FormRouteType;

    const queryClient = useQueryClient();

    const axiosFunction = () => {
        if (method === "POST") return axiosPost("members");
        if (method === "PUT") {
            if (!id) {
                navigation.setParams({
                    isError: true,
                    errorMessage: "ID is missing",
                });
            }
            return axiosPut(`members/${id}`);
        }
    };

    const mutation = useMutation<Jasen, Error, JasenForm, unknown>({
        mutationFn: axiosFunction(),
        onSuccess: (data) => {
            queryClient.setQueryData<JasenStateQuery[]>(
                ["MemberStates"],
                (oldList) =>
                    oldList?.map((i) => {
                        return i.jasen_id === data.jasen_id ? data : i;
                    })
            );

            if (method === "PUT") {
                queryClient.setQueryData(
                    ["MemberDetails", data.jasen_id],
                    data
                );
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
            etunimi: firstName,
            sukunimi: lastName,
            jakeluosoite: address,
            postinumero: zipCode,
            postitoimipaikka: city,
            puhelinnumero: phoneNumber,
            tila: memberState,
        };

        if (payload.etunimi?.trim() === "" || payload.sukunimi?.trim() === "") {
            navigation.setParams({
                isError: true,
                errorMessage: "Etunimi ja sukunimi ovat pakollisia",
            });
            return;
        }

        if (
            payload.jakeluosoite?.trim() === "" ||
            payload.jakeluosoite === null
        ) {
            delete payload.jakeluosoite;
        }

        if (
            payload.postinumero?.trim() === "" ||
            payload.postinumero === null
        ) {
            delete payload.postinumero;
        }

        if (
            payload.postitoimipaikka?.trim() === "" ||
            payload.postitoimipaikka === null
        ) {
            delete payload.postitoimipaikka;
        }

        if (
            payload.puhelinnumero?.trim() === "" ||
            payload.puhelinnumero === null
        ) {
            delete payload.puhelinnumero;
        }

        mutation.mutate(payload);
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`Lisää jäsen`} />
            <Button
                icon={() => (
                    <MaterialIcons
                        // name="save-alt"
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
