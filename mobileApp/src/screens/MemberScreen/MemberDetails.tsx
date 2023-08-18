import { View } from "react-native";
import { Jasen } from "../../types";
import { List, Divider, Text, Button } from "react-native-paper";


interface Props {
    route: any;
}

function MemberDetails({ route }: Props) {
    const jasen: Jasen = route.params.jasen;

    return (
        <View>
            <Text variant="headlineLarge" style={{ margin: 15 }}>{jasen.etunimi} {jasen.sukunimi}</Text>
            <Divider bold={true} />
            <List.Item title="Osoite" description={jasen.jakeluosoite} />
            <Divider />
            <List.Item title="Postinumero" description={jasen.postinumero} />
            <Divider />
            <List.Item title="Postitoimipaikka" description={jasen.postitoimipaikka} />
            <Divider />
            <List.Item title="Tila" description={jasen.tila} />
            <Divider />
            <Button 
                mode="contained"
                onPress={() => console.log("Pressed")}
                disabled={true}
                style={{ margin: 15, marginTop: 30 }}>
                    MUOKKAA
            </Button>
        </View>
    );
}

export default MemberDetails;