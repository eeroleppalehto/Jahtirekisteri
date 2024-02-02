import { ShareViewQuery } from "../../../types";
import IconListItem from "../../../components/IconListItem";
import { Text, MD3Theme } from "react-native-paper";

type Props = {
    data: ShareViewQuery;
    theme: MD3Theme;
};

export function ShareShotDetails({ data, theme }: Props) {
    const dateString = new Date(data.kaatopaiva).toLocaleDateString("fi-FI");
    return (
        <>
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
                title={"Paikka"}
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
                description={data.kaataja}
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
        </>
    );
}
