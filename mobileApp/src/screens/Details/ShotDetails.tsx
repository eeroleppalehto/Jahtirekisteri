import { Text, Divider, ActivityIndicator, useTheme } from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import useFetch from "../../../hooks/useFetch";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IconListItem from "../../components/IconListItem";
import { ShotViewQuery, UsageViewQuery } from "../../types";

type Props = RootStackScreenProps<"Details">;

//TODO: Get data from route params and render screen based on that
//TODO: Error handling if data is undefined
//TODO: Fetch usage data from backend

// Screen for displaying details screen for a shot
function ShotDetails({ route, navigation }: Props) {
    const results = useFetch<UsageViewQuery[]>(
        `views/?name=mobiili_kaadon_kasittely&column=kaadon_kasittely.kaato_id&value=${route.params.data.kaato_id}`
    );
    const theme = useTheme();
    if (!route.params) return <Text>Virhe!</Text>;

    const { data } = route.params as { data: ShotViewQuery };

    const locationTitle = "Paikka";

    const description = undefined;

    const dateString = new Date(data.kaatopaiva).toLocaleDateString("fi-FI");

    const UsageComponent = (usage: UsageViewQuery) => {
        return (
            <IconListItem
                iconSet="NoIcon"
                title={usage.kasittely_teksti}
                description={usage.kasittely_maara.toString()}
            />
        );
    };

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
                description={data.paikka_teksti}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="calendar"
                title={"Päivämäärä"}
                description={dateString}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account"
                title={"Kaataja"}
                description={data.kaatajan_nimi}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="scale"
                title={"Paino"}
                description={`${data.ruhopaino.toString()}kg`}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Eläin"}
                description={data.elaimen_nimi}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Ikäluokka"}
                description={data.ikaluokka}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Sukupuoli"}
                description={data.sukupuoli}
            />
            <IconListItem
                iconSet="NoIcon"
                title={"Lisätietoja"}
                description={data.lisatieto}
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
                {results.loading ? (
                    <ActivityIndicator
                        size={"large"}
                        style={{ paddingTop: 20 }}
                    />
                ) : (
                    results.data?.map((usage) => {
                        const descriptionText = `Määrä ${usage.kasittely_maara.toString()}%`;

                        return (
                            <IconListItem
                                key={usage.kasittelyid}
                                iconSet="NoIcon"
                                title={usage.kasittely_teksti}
                                description={descriptionText}
                            />
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}

export default ShotDetails;
