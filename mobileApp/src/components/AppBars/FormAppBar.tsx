import { Appbar, useTheme, Button } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { UsageForm, ShotFormType } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

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
                path = "members";
                payload = { ...data };
                break;

            case "Group":
                if (!data) {
                    console.log("no data");
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

        axios
            .post(`/api/v1/${path}`, payload)
            .then((res) => {
                navigation.setParams({ clear: true });
                console.log(`returned with status code ${res.status}`);
            })
            .catch((err) => {
                console.log(err);
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
                        size={22}
                        color={theme.colors.onPrimary}
                    />
                )}
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
            {/* <TouchableRipple
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: theme.colors.primary,
                    borderRadius: 24,
                    paddingLeft: 8,
                    marginRight: 8,
                }}
                onPress={() => handleShotFormSubmit()}
            >
                <Surface
                    elevation={1}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.colors.primary,
                        borderRadius: 24,
                        paddingLeft: 8,
                        gap: -8,
                    }}
                >
                    <Text
                        variant="bodyLarge"
                        style={{ color: theme.colors.onPrimary }}
                    >
                        Tallenna
                    </Text>
                    <Appbar.Action
                        icon="content-save-outline"
                        color={theme.colors.onPrimary}
                    />
                </Surface>
            </TouchableRipple> */}
        </Appbar.Header>
    );
}
