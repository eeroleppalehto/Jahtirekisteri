import { View } from "react-native";
import { List, Divider, Text, Button } from "react-native-paper";
import { Jasen } from "../../types";
import { RootStackScreenProps } from "../../NavigationTypes";
import { MaterialIcons } from "@expo/vector-icons";

type Props = RootStackScreenProps<"Details">;

// TODO: Refactor to use IconListItem component

// Screen for displaying details screen for a member
function MemberDetails({ route, navigation }: Props) {
    if (!route.params) return <Text>Virhe</Text>;

    // TODO: Error handling if data is undefined
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
                <List.Item title="Postinumero" description={postinumero} />
                <List.Item
                    title="Postitoimipaikka"
                    description={postitoimipaikka}
                />
                <List.Item title="Tila" description={tila} />
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
