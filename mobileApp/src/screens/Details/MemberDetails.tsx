import { View } from "react-native";
import { List, Divider, Text, Button } from "react-native-paper";
import { Jasen } from "../../types";
import { RootStackScreenProps } from "../../NavigationTypes";
import { MaterialIcons } from "@expo/vector-icons";

type Props = RootStackScreenProps<"Details">;

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

    return (
        <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
                <List.Item
                    title="Osoite"
                    description={jakeluosoite}
                    left={(props) => <MaterialIcons name="location-on" />}
                />
                {/* <Divider /> */}
                <List.Item title="Postinumero" description={postinumero} />
                {/* <Divider /> */}
                <List.Item
                    title="Postitoimipaikka"
                    description={postitoimipaikka}
                />
                {/* <Divider /> */}
                <List.Item title="Tila" description={tila} />
                {/* <Divider /> */}
            </View>
            <View>
                <Button
                    mode="contained"
                    onPress={() => console.log("Pressed")}
                    disabled={true}
                    style={{ margin: 15, marginTop: 30, marginBottom: 30 }}
                >
                    MUOKKAA
                </Button>
            </View>
        </View>
    );
}

export default MemberDetails;
