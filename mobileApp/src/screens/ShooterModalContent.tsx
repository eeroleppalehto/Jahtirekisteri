import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { ScrollView, View } from "react-native";
import {
    RadioButton,
    Text,
    ActivityIndicator,
    Divider,
    Button,
} from "react-native-paper";

type Shooter = {
    jasen_id: number;
    kokonimi: string;
};

type Props = {
    onValueChange: (value: string) => void;
};

function ShooterModalContent({ onValueChange }: Props) {
    const results = useFetch<Shooter[]>(
        "view/?viewName=nimivalinta",
        "GET",
        null
    );

    if (results.error) {
        return <Text>{results.error.message}</Text>;
    }

    return (
        <>
            {results.loading ? (
                <ActivityIndicator
                    size={"large"}
                    style={{ paddingVertical: 50 }}
                />
            ) : (
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Text variant="headlineMedium">Kaatajat</Text>
                    </View>
                    <Divider style={{ marginVertical: 15 }} />
                    <ScrollView>
                        <RadioButton.Group
                            onValueChange={(value) => onValueChange(value)}
                            value={"1"}
                        >
                            {results.data?.map((item) => (
                                <RadioButton.Item
                                    label={item.kokonimi}
                                    value={item.jasen_id.toString()}
                                    key={item.jasen_id}
                                />
                            ))}
                        </RadioButton.Group>
                    </ScrollView>
                    <Divider style={{ marginVertical: 15 }} />
                    <Button>Valitse</Button>
                </>
            )}
        </>
    );
}

export default ShooterModalContent;
