import { Text, Divider, useTheme } from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import useFetch from "../../../hooks/useFetch";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IconListItem from "../../components/IconListItem";

type Props = RootStackScreenProps<"Details">;

//TODO: Get data from route params and render screen based on that
//TODO: Error handling if data is undefined
//TODO: Fetch usage data from backend

// Screen for displaying details screen for a shot
function ShotDetails({ route, navigation }: Props) {
    const theme = useTheme();
    if (!route.params) return <Text>Virhe!</Text>;

    const locationTitle = "Paikka";

    const description = undefined;

    return (
        <ScrollView>
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                }}
            >
                Kaadon tiedot
            </Text>
            <IconListItem
                iconSet="MaterialIcons"
                iconNameMaterial="location-on"
                title={locationTitle}
                description={"Mynämäki"}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="calendar"
                title={"Päivämäärä"}
                description={"12.12.2020"}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account"
                title={"Kaataja"}
                description={description}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="scale"
                title={"Paino"}
                description={description}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Eläin"}
                description={description}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Ikäluokka"}
                description={description}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Sukupuoli"}
                description={description}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Lisätietoja"}
                description={description}
            />
            <Divider />
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                }}
            >
                Käsittelyt
            </Text>
            <View style={{ paddingTop: 20, paddingBottom: 300 }}>
                <IconListItem
                    iconSet="NoIcon"
                    title="Jäsenelle"
                    description={"Määrä 75%"}
                />
                <IconListItem
                    iconSet="NoIcon"
                    title="Seuralle"
                    description={"Määrä 25%"}
                />
            </View>
        </ScrollView>
    );
}

export default ShotDetails;
