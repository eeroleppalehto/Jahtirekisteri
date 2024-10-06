import { Text, useTheme, Divider, Switch, Portal } from "react-native-paper";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { RootStackScreenProps } from "../../NavigationTypes";
import IconTextInput from "../../components/IconTextInput";
import { View } from "react-native";
import { ErrorModal } from "../../components/ErrorModal";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";
import { useMemberFormStore } from "../../stores/formStore";

type Props = RootStackScreenProps<"MemberForm">;

type Status = "aktiivinen" | "poistunut";

// Form for adding a new member
export default function MemberForm({ route, navigation }: Props) {
    // Load form data from the store
    const {
        firstName,
        lastName,
        address,
        zipCode,
        city,
        phoneNumber,
        memberState,
        updateFirstName,
        updateLastName,
        updateAddress,
        updateZipCode,
        updateCity,
        updatePhoneNumber,
        updateMemberState,
        clearForm,
    } = useMemberFormStore((state) => ({
        firstName: state.etunimi,
        lastName: state.sukunimi,
        address: state.jakeluosoite,
        zipCode: state.postinumero,
        city: state.postitoimipaikka,
        phoneNumber: state.puhelinnumero,
        memberState: state.tila,
        updateFirstName: state.updateFirstName,
        updateLastName: state.updateLastName,
        updateAddress: state.updateAddress,
        updateZipCode: state.updateZipCode,
        updateCity: state.updateCity,
        updatePhoneNumber: state.updatePhoneNumber,
        updateMemberState: state.updateMemberState,
        clearForm: state.clearForm,
    }));

    useEffect(() => {
        if (route.params.method === "POST") {
            clearForm();
            updateMemberState("aktiivinen");
            setActive(true);
        }
    }, []);

    useEffect(() => {
        if (route.params.clearFields) {
            setActive(true);
            updateMemberState("aktiivinen");
            navigation.setParams({
                clearFields: false,
            });
        }
    }, [route.params.clearFields]);

    const [active, setActive] = useState<boolean>(true);

    const theme = useTheme();

    const { method, isError, isSuccess, errorMessage } = route.params as {
        method: string;
        isError: boolean;
        isSuccess: boolean;
        errorMessage: string;
    };

    const onFirstNameChange = (text: string) => {
        updateFirstName(text);
    };

    const onLastNameChange = (text: string) => {
        updateLastName(text);
    };

    const onAddressChange = (text: string) => {
        updateAddress(text);
    };

    const onZipChange = (text: string) => {
        updateZipCode(text);
    };

    const onCityChange = (text: string) => {
        updateCity(text);
    };

    const onPhoneChange = (text: string) => {
        updatePhoneNumber(text);
    };

    const onValueChange = (value: boolean) => {
        setActive(value);
        updateMemberState(value ? "aktiivinen" : "poistunut");
        console.log("Value: ", value);
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
                    value={firstName}
                    onChangeText={onFirstNameChange}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="person"
                    label="Sukunimi"
                    required={true}
                    inputType="default"
                    value={lastName}
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
                    value={phoneNumber}
                    onChangeText={onPhoneChange}
                />
                <IconTextInput
                    iconSet="MaterialIcons"
                    iconNameMaterial="home"
                    label="Osoite"
                    required={false}
                    inputType="default"
                    value={address}
                    onChangeText={onAddressChange}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="home-city"
                    label="Postitoimipaikka"
                    required={false}
                    inputType="default"
                    value={city}
                    onChangeText={onCityChange}
                />
                <IconTextInput
                    iconSet="MaterialCommunityIcons"
                    iconNameMaterialCommunity="numeric"
                    label="Postinumero"
                    required={false}
                    inputType="numeric"
                    value={zipCode}
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
