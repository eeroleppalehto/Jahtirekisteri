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

/**
 * React functional component for displaying a date picker modal.
 * @date 11/10/2023 - 12:50:24 PM
 *
 * @param {Date | undefined} initDate Initial date for the date picker
 * @param {(date: Date | undefined) => void} setDate Callback function for setting the date
 * @param {boolean} open Is the modal open
 * @param {(open: boolean) => void} setOpen Callback function for setting the open state
 * @returns {*}
 */
export default function DatePicker({
    initDate,
    setDate,
    open,
    setOpen,
}: Props) {
    // Callback function for dismissing the modal
    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    // Callback function for confirming the date
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
