import {
    Appbar,
    Text,
    Surface,
    useTheme,
    TouchableRipple,
} from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { UsageForm, ShotFormType } from "../../types";
import { BASE_URL } from "../../baseUrl";

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

    // The callback function that is called when the user presses the save button
    // TODO: Exract this function to a separate file
    // TODO: Check if the form is valid before submitting
    const handleShotFormSubmit = () => {
        let path: string = "";
        const method = "POST";
        let payload: any;

        if (type === "kaato") {
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

            path = `createShotUsage`;

            payload = {
                shot,
                usages,
            };
        } else if (type === "jäsen") {
            if (!data) {
                console.log("no data");
                return;
            }
            path = "members";
            payload = { ...data };
        } else {
            console.log("no type");
            return;
        }

        console.log("Submitting...");

        fetch(`${BASE_URL}/api/${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
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
            <Appbar.Content title={`Lisää ${type}`} />
            <TouchableRipple
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: theme.colors.primary,
                    borderRadius: 16,
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
                        borderRadius: 16,
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
            </TouchableRipple>
        </Appbar.Header>
    );
}
