import {
    RadioButton,
    ActivityIndicator,
    TextInput,
    useTheme,
} from "react-native-paper";
import { RadioButtonItem } from "./RadioButtonItem";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../../screens/ErrorScreen";
import { useCallback, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = {
    shooterId: number | undefined;
    onValueChange: (value: Shooter) => void;
};

export function ShooterRadioGroup({ shooterId, onValueChange }: Props) {
    const [selectedShooterId, setSelectedShooterId] = useState<
        number | undefined
    >(shooterId);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const result = useFetchQuery<Shooter[]>(
        "views/?name=nimivalinta",
        "NameSelection"
    );

    const theme = useTheme();

    // Callback function for changing the selected shooter
    const handleChange = (value: string) => {
        setSelectedShooterId(parseInt(value));
        // Find the selected shooter from the results
        const selectedShooter = result.data?.find(
            (item) => item.jasen_id === parseInt(value)
        );
        // Pass the selected shooter to the parent components callback function
        onValueChange(selectedShooter!);
    };

    const handleRefresh = useCallback(() => {
        setRefreshing(!true);
        result.refetch();
    }, []);

    // If shooterId is defined, use it as the initial value,
    // otherwise use the first shooter from the results.
    // If results are still loading, use an empty string
    const initialValue = shooterId // This Stinks!
        ? shooterId.toString()
        : result.data
        ? result.data[0].jasen_id.toString()
        : "";

    const filteredData = result.data?.filter((item) =>
        item.kokonimi.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {result.isLoading && (
                <ActivityIndicator
                    size={"large"}
                    style={{ paddingVertical: 20 }}
                />
            )}
            {result.isError && (
                <ErrorScreen error={result.error} reload={result.refetch} />
            )}
            {result.isSuccess && (
                <>
                    <TextInput
                        label="Hae"
                        mode="outlined"
                        value={search}
                        right={<TextInput.Icon icon="magnify" />}
                        style={{ marginHorizontal: 5 }}
                        onChangeText={(text) => setSearch(text)}
                    />
                    <BottomSheetFlatList
                        data={filteredData}
                        keyExtractor={(item) => item.jasen_id.toString()}
                        renderItem={({ item }) => (
                            <RadioButtonItem
                                label={item.kokonimi}
                                value={item.jasen_id.toString()}
                                theme={theme}
                                status={
                                    selectedShooterId === item.jasen_id
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={handleChange}
                            />
                        )}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                </>
            )}
        </>
    );
}
