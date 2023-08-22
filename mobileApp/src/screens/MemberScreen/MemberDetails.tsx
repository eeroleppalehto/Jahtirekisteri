import { View } from "react-native";
import { List, Divider, Text, Button, TextInput } from "react-native-paper";
import { useState } from "react";

import { Jasen } from "../../types";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type Props = MaintenanceTabScreenProps<"Jäsenet">;

function MemberDetails({ route, navigation }: Props) {
    try {
    } catch (error) {
        return <Text>Virhe</Text>;
    }

    if (!route.params) return <Text>Virhe</Text>;

    const { data } = route.params;
    const {
        etunimi,
        sukunimi,
        jasen_id,
        postitoimipaikka,
        postinumero,
        jakeluosoite,
        tila,
    } = data;
    //const data: Jasen = route.params.data;

    const [firstName, setfirstName] = useState<string>(etunimi);

    return (
        <View>
            <Text variant="headlineLarge" style={{ margin: 15 }}>
                {etunimi} {sukunimi}
            </Text>
            <Divider bold={true} />
            <List.Item title="Osoite" description={jakeluosoite} />
            <Divider />
            <List.Item title="Postinumero" description={postinumero} />
            <Divider />
            <List.Item
                title="Postitoimipaikka"
                description={postitoimipaikka}
            />
            <Divider />
            <List.Item title="Tila" description={tila} />
            <Divider />
            <TextInput
                mode="outlined"
                label="Etunimi"
                value={firstName}
                onChangeText={(text) => setfirstName(text)}
                style={{ margin: 15 }}
            />
            <Button
                mode="contained"
                onPress={() => console.log("Pressed")}
                disabled={true}
                style={{ margin: 15, marginTop: 30 }}
            >
                MUOKKAA
            </Button>
            <View
                style={{
                    height: 40,
                    borderRadius: 2,
                    borderColor: "black",
                    borderWidth: 1,
                    margin: 15,
                    padding: 5,
                    backgroundColor: "white",
                }}
            >
                <Text>Daa</Text>
            </View>
        </View>
    );
}

export default MemberDetails;
