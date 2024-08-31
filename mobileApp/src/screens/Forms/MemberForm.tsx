import {
    Text,
    useTheme,
    Divider,
    Switch,
    Checkbox,
    Button,
    Portal,
} from "react-native-paper";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { JasenForm } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import { RootStackScreenProps } from "../../NavigationTypes";
import CustomInput from "../../components/CustomInput";
import IconTextInput from "../../components/IconTextInput";
import { View } from "react-native";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { err } from "react-native-svg";

type navType = MaintenanceTabScreenProps<"Jäsenet">["navigation"];

type Props = RootStackScreenProps<"Forms">;

type Status = "aktiivinen" | "poistunut";

// Form for adding a new member
export default function MemberForm({ route, navigation }: Props) {
    // Initialize the form with empty values and set it to route params
    useEffect(() => {
        // TODO: Make this into a custom hook that returns the params
        if (route.params?.clear !== false) {
            navigation.setParams({
                data: {
                    etunimi: "",
                    sukunimi: "",
                    jakeluosoite: "",
                    postinumero: "",
                    postitoimipaikka: "",
                    tila: "aktiivinen",
                },
            });
            navigation.setParams({ clear: false });
        }
    }, [route.params?.clear]);

    const [status, setStatus] = useState<Status>("aktiivinen");

    const [active, setActive] = useState<boolean>(true);

    const theme = useTheme();

    const { data, isError, isSuccess, errorMessage } = route.params as {
        data: JasenForm;
        isError: boolean;
        isSuccess: boolean;
        errorMessage?: string;
    };

    const onFirstNameChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                etunimi: text,
            },
        });
    };

    const onLastNameChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                sukunimi: text,
            },
        });
    };

    const onAddressChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                jakeluosoite: text,
            },
        });
    };

    const onZipChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                postinumero: text,
            },
        });
    };

    const onCityChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                postitoimipaikka: text,
            },
        });
    };

    const onPhoneChange = (text: string) => {
        navigation.setParams({
            data: {
                ...data,
                puhelinnumero: text,
            },
        });
    };

    const onValueChange = (value: boolean) => {
        setActive(value);
        navigation.setParams({
            data: {
                ...data,
                tila: value ? "aktiivinen" : "poistunut",
                //BUG: Doesn't change the value on the first click, but does on later clicks
            },
        });
    };

    return (
        <>
            <Portal>
                <ErrorModal
                    isError={isError}
                    onDismiss={() =>
                        navigation.setParams({
                            isError: false,
                            errorMessage: undefined,
                        })
                    }
                    message={errorMessage}
                />
                <SuccessSnackbar
                    isSuccess={isSuccess}
                    onDismiss={() => navigation.setParams({ isSuccess: false })}
                />
            </Portal>
            <ScrollView>
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    Nimitiedot
                </Text>
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="person"
                    label="Etunimi"
                    required={true}
                    inputType="default"
                    value={data ? data.etunimi : ""}
                    onChangeText={onFirstNameChange}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="person"
                    label="Sukunimi"
                    required={true}
                    inputType="default"
                    value={data ? data.sukunimi : ""}
                    onChangeText={onLastNameChange}
                />
                <Divider />
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    Yhteystiedot
                </Text>
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="phone"
                    label="Puhelinnumero"
                    required={false}
                    inputType="phone-pad"
                    value={data ? data.puhelinnumero : ""}
                    onChangeText={onPhoneChange}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="home"
                    label="Osoite"
                    required={false}
                    inputType="default"
                    value={data ? data.jakeluosoite : ""}
                    onChangeText={onAddressChange}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="home-city"
                    label="Postitoimipaikka"
                    required={false}
                    inputType="default"
                    value={data ? data.postitoimipaikka : ""}
                    onChangeText={onCityChange}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="numeric"
                    label="Postinumero"
                    required={false}
                    inputType="numeric"
                    value={data ? data.postinumero : ""}
                    onChangeText={onZipChange}
                />
                <Divider />
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 20,
                    }}
                >
                    Muut tiedot
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                        paddingLeft: 50,
                        paddingRight: 55,
                        marginBottom: 300,
                    }}
                >
                    <Text variant="bodyLarge"> Aktiivinen </Text>
                    <Switch value={active} onValueChange={onValueChange} />
                </View>
            </ScrollView>
        </>
    );
}
