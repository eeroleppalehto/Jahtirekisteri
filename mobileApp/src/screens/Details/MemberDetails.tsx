import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
    Text,
    useTheme,
    Avatar,
    Chip,
    Button,
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
import { useMemberFormStore } from "../../stores/formStore";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

type Props = RootStackScreenProps<"Details">;

// Screen for displaying details screen for a member
function MemberDetails({ route, navigation }: Props) {
    if (!route.params) return <Text>Virhe</Text>;

    // TODO: Error handling if data is undefined
    const { data } = route.params as { data: JasenStateQuery };

    const member = getMember(data.jasen_id);
    if (!member) return <Text>Virhe ladattaessa välimuistia</Text>;

    const { authState } = useAuth();

    // DO NOT REMOVE!
    // This allows the screen to rerender after returning from edit form
    const isFocused = useIsFocused();

    const theme = useTheme();

    const hasEditRights = authState?.role
        ? EDIT_RIGHTS_SET.has(authState.role)
        : false;

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
            {isFocused ? (
                <View style={{ paddingBottom: 300 }}>
                    <View
                        style={{
                            alignItems: "center",
                            paddingTop: 60,
                        }}
                    >
                        {TextAvatar(member.etunimi, member.sukunimi)}
                        <Text
                            variant="headlineMedium"
                            style={{ paddingTop: 60, paddingBottom: 10 }}
                        >{`${member.sukunimi} ${member.etunimi}`}</Text>
                        <Chip mode="flat" elevated={false}>
                            {member.tila}
                        </Chip>
                    </View>
                    {hasEditRights ? (
                        <>
                            <MemberInfo
                                id={data.jasen_id}
                                theme={theme}
                                hasEditRights={hasEditRights}
                            />
                        </>
                    ) : null}
                </View>
            ) : null}
        </ScrollView>
    );
}

type MembersInfoProps = {
    id: number;
    theme: MD3Theme;
    hasEditRights: boolean;
};

export function MemberInfo({ id, theme, hasEditRights }: MembersInfoProps) {
    const queryClient = useQueryClient();
    const result = useFetchQuery<Jasen>(`members/${id}`, ["MemberDetails", id]);

    const navigation = useNavigation();

    const memberFormStore = useMemberFormStore();

    const handleEditnavigation = () => {
        if (!result.isSuccess) return;

        memberFormStore.updateFirstName(result.data.etunimi);
        memberFormStore.updateLastName(result.data.sukunimi);
        memberFormStore.updateAddress(result.data.jakeluosoite);
        memberFormStore.updateCity(result.data.postitoimipaikka);
        memberFormStore.updateZipCode(result.data.postinumero);
        memberFormStore.updatePhoneNumber(result.data.puhelinnumero);
        memberFormStore.updateMemberState(result.data.tila);

        navigation.navigate("MemberForm", {
            method: "PUT",
            id: id,
            isError: false,
            clearFields: false,
            isSuccess: false,
            errorMessage: "",
        });
    };

    return (
        <>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {result.isSuccess ? (
                <>
                    {hasEditRights ? (
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Button
                                icon="account-edit"
                                mode="contained"
                                style={{ width: 140 }}
                                onPress={handleEditnavigation}
                            >
                                Muokkaa
                            </Button>
                        </View>
                    ) : null}
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

function getMember(memberId: number) {
    const queryClient = useQueryClient();

    const memberStateArray = queryClient.getQueryData<JasenStateQuery[]>([
        "MemberStates",
    ]);
    if (!memberStateArray) return undefined;

    const member = memberStateArray.find((i) => i.jasen_id === memberId);
    if (!member) return undefined;

    return member;
}

export default MemberDetails;
