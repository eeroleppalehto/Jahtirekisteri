import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, useTheme, Avatar, Chip, Surface } from "react-native-paper";
import { Jasen } from "../../types";
import { RootStackScreenProps } from "../../NavigationTypes";
import IconListItem from "../../components/IconListItem";

type Props = RootStackScreenProps<"Details">;

// Screen for displaying details screen for a member
function MemberDetails({ route, navigation }: Props) {
    if (!route.params) return <Text>Virhe</Text>;

    const theme = useTheme();

    // TODO: Error handling if data is undefined
    const { data } = route.params as { data: Jasen };

    const TextAvatar = (firstname: string, lastname: string) => {
        const firstLetter = firstname.charAt(0).toUpperCase();
        const secondLetter = lastname.charAt(0).toUpperCase();
        return (
            <Avatar.Text
                size={150}
                label={`${secondLetter}${firstLetter}`}
                labelStyle={{ fontSize: 70 }}
            />
        );
    };

    return (
        <ScrollView>
            <View style={{ paddingBottom: 300 }}>
                <View
                    style={{
                        alignItems: "center",
                        paddingTop: 60,
                    }}
                >
                    {TextAvatar(data.etunimi, data.sukunimi)}
                    <Text
                        variant="headlineMedium"
                        style={{ paddingTop: 60, paddingBottom: 10 }}
                    >{`${data.sukunimi} ${data.etunimi}`}</Text>
                    <Chip mode="flat" elevated={false}>
                        {data.tila}
                    </Chip>
                </View>
                <Text
                    variant="titleMedium"
                    style={{
                        color: theme.colors.primary,
                        paddingLeft: 16,
                        paddingTop: 60,
                    }}
                >
                    {"Yhteystiedot"}
                </Text>
                <IconListItem
                    iconSet="MaterialIcons"
                    iconNameMaterial="phone"
                    title="Puhelinnumero"
                    description={data.puhelinnumero}
                />
                <IconListItem
                    iconSet="MaterialIcons"
                    iconNameMaterial="location-on"
                    title="Osoite"
                    description={data.jakeluosoite}
                />
                <IconListItem
                    iconSet="MaterialIcons"
                    iconNameMaterial="location-on"
                    title="Postinumero"
                    description={data.postinumero}
                />
                <IconListItem
                    iconSet="MaterialIcons"
                    iconNameMaterial="location-on"
                    title="Postitoimipaikka"
                    description={data.postitoimipaikka}
                />
            </View>
        </ScrollView>
    );
}

export default MemberDetails;
