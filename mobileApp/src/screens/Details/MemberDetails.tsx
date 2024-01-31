import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
    Text,
    useTheme,
    Avatar,
    Chip,
    Surface,
    MD3Theme,
    ActivityIndicator,
} from "react-native-paper";
import { Jasen, JasenStateQuery } from "../../types";
import { RootStackScreenProps } from "../../NavigationTypes";
import IconListItem from "../../components/IconListItem";
import { useAuth } from "../../context/AuthProvider";
import { EDIT_RIGHTS_SET } from "../../utils/authenticationUtils";
import { ErrorScreen } from "../ErrorScreen";
import { useFetchQuery } from "../../hooks/useTanStackQuery";

type Props = RootStackScreenProps<"Details">;

// Screen for displaying details screen for a member
function MemberDetails({ route, navigation }: Props) {
    if (!route.params) return <Text>Virhe</Text>;

    const { authState } = useAuth();

    const theme = useTheme();

    const hasEditRights = authState?.role
        ? EDIT_RIGHTS_SET.has(authState.role)
        : false;

    // TODO: Error handling if data is undefined
    const { data } = route.params as { data: JasenStateQuery };

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
                {hasEditRights ? (
                    <MemberInfo id={data.jasen_id} theme={theme} />
                ) : null}
            </View>
        </ScrollView>
    );
}

type MembersInfoProps = {
    id: number;
    theme: MD3Theme;
};

function MemberInfo({ id, theme }: MembersInfoProps) {
    const result = useFetchQuery<Jasen>(`members/${id}`, ["MemberDetails", id]);

    return (
        <>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess ? (
                <>
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
                        description={result.data.puhelinnumero}
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Osoite"
                        description={result.data.jakeluosoite}
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Postinumero"
                        description={result.data.postinumero}
                    />
                    <IconListItem
                        iconSet="MaterialIcons"
                        iconNameMaterial="location-on"
                        title="Postitoimipaikka"
                        description={result.data.postitoimipaikka}
                    />
                </>
            ) : null}
        </>
    );
}

export default MemberDetails;
