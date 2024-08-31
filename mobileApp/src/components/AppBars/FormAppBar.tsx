import { Appbar, useTheme, Button } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { UsageForm, ShotFormType } from "../../types";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = NativeStackHeaderProps;

// The AppBar component that is rendered in the FormScreen
// includes logic to handle the form submit
export default function FormAppBar({
    back,
    navigation,
    route,
    options,
}: Props) {
    const { type, data, shot, usage, clear } = route.params as {
        type: string;
        data: any;
        shot?: ShotFormType;
        usage?: UsageForm[];
        clear?: any;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        navigation.setParams({ isError: isError, isSuccess: isSuccess });
    }, [isError, isSuccess]);

    const theme = useTheme();

    const getTitle = (type: string) => {
        switch (type) {
            case "Shot":
                return "Lisää kaato";
            case "Member":
                return "Lisää jäsen";
            case "Group":
                return "Lisää ryhmä";
            case "Party":
                return "Lisää seurue";
            case "MemberShare":
                return "Lisää jäsenjako";
            case "GroupShare":
                return "Lisää ryhmäjako";
            case "Membership":
                return "Lisää jäsenyys";
            default:
                return "Lisää";
        }
    };

    // The callback function that is called when the user presses the save button
    // TODO: Exract this function to a separate file
    // TODO: Check if the form is valid before submitting
    const handleShotFormSubmit = () => {
        let path: string = "";
        let payload: any;

        switch (type) {
            case "Shot":
                if (!shot) {
                    console.log("no shot data");
                    return;
                }
                if (!usage) {
                    console.log("no usage data");
                    return;
                }

                const usages = usage.filter(
                    (item) => item.kasittelyid !== undefined
                );

                if (shot.lisatieto?.trim() === "") {
                    delete shot.lisatieto;
                }

                path = `shot-with-usages`;

                payload = {
                    shot,
                    usages,
                };
                break;
            case "Member":
                if (!data) {
                    console.log("no data");
                    return;
                }

                if (data.etunimi.trim() === "" || data.sukunimi.trim() === "") {
                    navigation.setParams({
                        isError: true,
                        errorMessage: "Etunimi ja sukunimi ovat pakollisia",
                    });
                    return;
                }

                if (data.jakeluosoite.trim() === "") {
                    delete data.jakeluosoite;
                }

                if (data.postinumero.trim() === "") {
                    delete data.postinumero;
                }

                if (data.postitoimipaikka.trim() === "") {
                    delete data.postitoimipaikka;
                }

                path = "members";
                payload = { ...data };
                break;

            case "Group":
                if (!data) {
                    console.log("no data");
                    return;
                }

                console.log("group data", data);

                if (data.ryhman_nimi.trim() === "") {
                    navigation.setParams({
                        isError: true,
                        errorMessage: "Ryhmän nimi on pakollinen",
                    });
                    return;
                }

                path = "groups";
                payload = { ...data };
                break;
            case "Party":
                if (!data) {
                    console.log("no data");
                    return;
                }

                if (data.seurueen_nimi.trim() === "") {
                    navigation.setParams({
                        isError: true,
                        errorMessage: "Seurueen nimi on pakollinen",
                    });
                    return;
                }

                path = "parties";
                payload = { ...data };
                break;

            case "MemberShare":
                if (!data) {
                    console.log("no data");
                    return;
                }
                path = "member-shares";
                payload = { ...data };
                break;
            case "GroupShare":
                if (!data) {
                    console.log("no data");
                    return;
                }
                path = "shares";
                payload = { ...data };
                break;
            case "Membership":
                if (!data) {
                    console.log("no data");
                    return;
                }
                path = "memberships";
                payload = { ...data };
                break;
            default:
                console.log("no type");
                return;
        }

        console.log("Submitting...");
        setIsLoading(true);
        axios
            .post(`/api/v2/${path}`, payload)
            .then((res) => {
                navigation.setParams({ clear: true });
                console.log(`returned with status code ${res.status}`);
                setIsLoading(false);
                // setIsSuccess(true);
                navigation.setParams({ isSuccess: true });
                if (type === "MemberShare" || type === "GroupShare") {
                    setTimeout(() => navigation.goBack(), 1500);
                }
            })
            .catch((err) => {
                console.log("Error in submitting form");
                console.log(err);
                navigation.setParams({ isError: true });
                // setIsError(true);
                setIsLoading(false);
            });
    };

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={`${getTitle(type)}`} />
            <Button
                // icon="content-save-outline"
                icon={() => (
                    <MaterialIcons
                        name="save-alt"
                        size={24}
                        color={theme.colors.onPrimary}
                    />
                )}
                loading={isLoading}
                disabled={isLoading}
                mode="contained-tonal"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                style={{ marginRight: 12 }}
                contentStyle={{ flexDirection: "row-reverse", padding: 4 }}
                labelStyle={{ fontSize: 16 }}
                onPress={() => handleShotFormSubmit()}
            >
                Tallenna
            </Button>
        </Appbar.Header>
    );
}
