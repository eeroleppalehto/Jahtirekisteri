import { useCallback } from "react";
import { Text } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { DatePickerModalContentSingleProps } from "react-native-paper-dates/lib/typescript/Date/DatePickerModalContent";

type DatePickerModalSingleOnConfirm =
    DatePickerModalContentSingleProps["onConfirm"];

type Props = {
    initDate?: Date;
    setDate: (date: Date | undefined) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function DatePicker({
    initDate,
    setDate,
    open,
    setOpen,
}: Props) {
    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = useCallback<DatePickerModalSingleOnConfirm>(
        ({ date }) => {
            setOpen(false);
            setDate(date);
        },
        [setOpen, setDate]
    );

    return (
        <DatePickerModal
            locale="fi"
            mode="single"
            presentationStyle="pageSheet"
            visible={open}
            onDismiss={onDismissSingle}
            date={initDate}
            onConfirm={onConfirmSingle}
        />
    );
}
