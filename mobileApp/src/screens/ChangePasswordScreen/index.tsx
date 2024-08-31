import { View } from "react-native";
import { useTheme, Button, TextInput, Text, Portal } from "react-native-paper";
import { useAuth } from "../../context/AuthProvider";
import axios, { AxiosError } from "axios";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SuccessSnackbar } from "../../components/SuccessSnackbar";

type PasswordChangeForm = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

type Props = DrawerHeaderProps;

export function ChangePasswordScreen() {
    const [form, setForm] = useState<PasswordChangeForm>({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [oldPasswordSecure, setOldPasswordSecure] = useState(true);
    const [newPasswordSecure, setNewPasswordSecure] = useState(true);
    const [confirmNewPasswordSecure, setConfirmNewPasswordSecure] =
        useState(true);

    const { authState } = useAuth();
    const theme = useTheme();

    const handleButtonPress = () => {
        setIsLoading(true);
        setIsSuccess(false);
        setErrorMessage(null);

        if (!validatePassword(form.newPassword)) {
            setIsLoading(false);
            setErrorMessage(
                "Salasana ei täytä vaadittuja kriteereitä.\nYritä uudelleen."
            );
            return;
        }

        if (form.newPassword !== form.confirmNewPassword) {
            setIsLoading(false);
            setErrorMessage("Uudet salasanat eivät täsmää.\nYritä uudelleen.");
            return;
        }

        axios
            .post("/api/v2/auth/change-password", {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                confirmNewPassword: form.confirmNewPassword,
            })
            .then((response) => {
                console.log(response.status);
                setIsLoading(false);
                setIsSuccess(true);
                setForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
            })
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 400) {
                        setIsLoading(false);
                        setErrorMessage(
                            "Uudet salasanat eivät täsmää.\nYritä uudelleen."
                        );
                        return;
                    }
                    if (error.response?.status === 401) {
                        setIsLoading(false);
                        setErrorMessage(
                            "Väärä vanha salasana.\nYritä uudelleen."
                        );
                        return;
                    }
                }

                if (error.message === "Network Error") {
                    setIsLoading(false);
                    setErrorMessage(
                        "Verkkovirhe.\nTarkista verkkoyhteys ja yritä uudelleen."
                    );
                    return;
                }

                setIsLoading(false);
                setErrorMessage(
                    "Salasanan vaihto epäonnistui.\nYritä uudelleen."
                );
            });
    };

    const validatePassword = (password: string) => {
        // At least 8 characters long and must contain at least one number, special character, uppercase and lowercase letter.
        const passwordRegex =
            /^(?=.*[0-9])(?=.*[!@#$%^&*"'])(?=.*[A-ZÄÖÅ])(?=.*[a-zäöå]).{8,}$/;
        return passwordRegex.test(password);
    };

    const passwordCriteriaList = [
        "Vähintään 8 merkkiä pitkä",
        "Sisältää vähintään yhden numeron",
        "Sisältää vähintään yhden erikoismerkin",
        "Sisältää vähintään yhden ison sekä pienen kirjaimen",
    ];

    return (
        <View style={{ margin: 20, gap: 30 }}>
            <Portal>
                <SuccessSnackbar
                    isSuccess={isSuccess}
                    onDismiss={() => setIsSuccess(false)}
                />
            </Portal>
            <TextInput
                value={form.oldPassword}
                autoCapitalize="none"
                onChangeText={(text) => setForm({ ...form, oldPassword: text })}
                mode="outlined"
                label="Vanha salasana"
                secureTextEntry={oldPasswordSecure}
                right={
                    <TextInput.Icon
                        icon={oldPasswordSecure ? "eye" : "eye-off"}
                        onPress={() => setOldPasswordSecure(!oldPasswordSecure)}
                    />
                }
            />
            <TextInput
                value={form.newPassword}
                autoCapitalize="none"
                onChangeText={(text) => setForm({ ...form, newPassword: text })}
                mode="outlined"
                label="Uusi salasana"
                secureTextEntry={newPasswordSecure}
                right={
                    <TextInput.Icon
                        icon={newPasswordSecure ? "eye" : "eye-off"}
                        onPress={() => setNewPasswordSecure(!newPasswordSecure)}
                    />
                }
            />
            <TextInput
                value={form.confirmNewPassword}
                autoCapitalize="none"
                onChangeText={(text) =>
                    setForm({ ...form, confirmNewPassword: text })
                }
                mode="outlined"
                label="Vahvista uusi salasana"
                secureTextEntry={confirmNewPasswordSecure}
                right={
                    <TextInput.Icon
                        icon={confirmNewPasswordSecure ? "eye" : "eye-off"}
                        onPress={() =>
                            setConfirmNewPasswordSecure(
                                !confirmNewPasswordSecure
                            )
                        }
                    />
                }
            />
            {errorMessage && (
                <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.error }}
                >
                    {errorMessage}
                </Text>
            )}
            <View>
                <Text
                    variant="labelLarge"
                    style={{ color: theme.colors.primary }}
                >
                    Uuden salasanan tulee täyttää seuraavat kriteerit:
                </Text>
                <View>
                    {passwordCriteriaList.map((criteria, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="circle-medium"
                                size={16}
                                color={theme.colors.primary}
                            />
                            <Text style={{ lineHeight: 30 }}>{criteria}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <Button
                mode="contained"
                onPress={handleButtonPress}
                loading={isLoading}
            >
                {"Vaihda salasana".toUpperCase()}
            </Button>
        </View>
    );
}
