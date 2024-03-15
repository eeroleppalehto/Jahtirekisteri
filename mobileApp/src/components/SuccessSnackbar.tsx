import { Snackbar } from "react-native-paper";

type Props = {
    isSuccess: boolean;
    onDismiss: () => void;
    message?: string;
};

export function SuccessSnackbar({ isSuccess, onDismiss, message }: Props) {
    return (
        <Snackbar
            visible={isSuccess}
            onDismiss={onDismiss}
            action={{
                label: "OK",
                onPress: onDismiss,
            }}
        >
            {message ? message : `Tallennettu onnistuneesti!`}
        </Snackbar>
    );
}
