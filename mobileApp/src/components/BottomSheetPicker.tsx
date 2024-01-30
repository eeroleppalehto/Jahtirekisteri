import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState, forwardRef } from "react";
import { useTheme } from "react-native-paper";

type Prop = {
    children: JSX.Element | JSX.Element[] | (() => JSX.Element);
};

type BottomSheetRef = BottomSheet;

export const BottomSheetPicker = forwardRef<BottomSheetRef, Prop>(
    ({ children }, ref) => {
        // ref
        // const bottomSheetRef = useRef<BottomSheet>(null);

        // hooks
        const theme = useTheme();

        // variables
        const snapPoints = useMemo(() => ["25%", "40%", "70%"], []);

        // callbacks
        // const handleSheetChanges = useCallback((index: number) => {
        //     console.log("handleSheetChanges", index);
        // }, []);

        // renders
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                />
            ),
            []
        );

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                // enableDynamicSizing={true}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{
                    backgroundColor: theme.colors.surface,
                }}
                backdropComponent={renderBackdrop}
            >
                {children}
            </BottomSheet>
        );
    }
);
