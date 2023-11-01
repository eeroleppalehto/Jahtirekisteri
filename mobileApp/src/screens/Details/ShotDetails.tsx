import { Text, MD3Colors, Divider, useTheme } from "react-native-paper";
import { BottomTabScreenProps } from "../../NavigationTypes";
import useFetch from "../../../hooks/useFetch";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import IconListItem from "../../components/IconListItem";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = BottomTabScreenProps<"Kaadot">;

function ShotDetails({ route, navigation }: Props) {
    const theme = useTheme();
    if (!route.params) return <Text>Virhe!</Text>;

    const LocationIcon = (
        <MaterialIcons
            name="location-on"
            size={24}
            style={{ color: MD3Colors.neutral40 }}
        />
    );

    const locationTitle = "Paikka";

    const ShooterIcon = (
        <MaterialCommunityIcons
            name="account"
            size={24}
            style={{ color: MD3Colors.neutral40 }}
        />
    );
    const shooterTitle = "Kaataja";

    const DateIcon = (
        <MaterialCommunityIcons
            name="calendar"
            size={24}
            style={{ color: MD3Colors.neutral40 }}
        />
    );

    const WeightIcon = (
        <MaterialCommunityIcons
            name="scale"
            size={24}
            style={{ color: MD3Colors.neutral40 }}
        />
    );
    const weightTitle = "Paino";

    const description = null;

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
                icon={LocationIcon}
                title={locationTitle}
                description={"Mynämäki"}
            />
            <IconListItem
                icon={DateIcon}
                title={"Päivämäärä"}
                description={"12.12.2020"}
            />
            <IconListItem
                icon={ShooterIcon}
                title={"Kaataja"}
                description={description}
            />
            <IconListItem
                icon={WeightIcon}
                title={"Paino"}
                description={description}
            />
            <IconListItem
                icon={null}
                title={"Eläin"}
                description={description}
            />
            <IconListItem
                icon={null}
                title={"Ikäluokka"}
                description={description}
            />
            <IconListItem
                icon={null}
                title={"Sukupuoli"}
                description={description}
            />
            <IconListItem
                icon={null}
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
                    icon={null}
                    title="Jäsenelle"
                    description={"Määrä 75%"}
                />
                <IconListItem
                    icon={null}
                    title="Seuralle"
                    description={"Määrä 25%"}
                />
            </View>
        </ScrollView>
    );
}

export default ShotDetails;
