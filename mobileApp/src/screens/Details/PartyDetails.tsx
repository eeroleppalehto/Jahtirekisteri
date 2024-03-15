import {
    PartyViewQuery,
    MembershipViewQuery,
    GroupViewQuery,
} from "../../types";
import { View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Divider,
    MD3Theme,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorScreen } from "../ErrorScreen";
import { RootStackScreenProps } from "../../NavigationTypes";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import IconListItem from "../../components/IconListItem";

type Props = RootStackScreenProps<"Details">;

type PartyTypeNames = "Ryhmä" | "Jäsen";

export function PartyDetails({ route, navigation }: Props) {
    const party = route.params?.data as PartyViewQuery;

    const theme = useTheme();

    const partyDetailsView = (party: PartyViewQuery) => {
        const partyTypeName = party.seurue_tyyppi_nimi as PartyTypeNames;
        switch (partyTypeName) {
            case "Ryhmä":
                return (
                    <PartyGroups
                        partyId={party.seurue_id}
                        theme={theme}
                        navigation={navigation}
                    />
                );
            case "Jäsen":
                return (
                    <PartyMembers
                        partyId={party.seurue_id}
                        theme={theme}
                        navigation={navigation}
                    />
                );
            default:
                return <ErrorScreen error={new Error("asdd")} />;
        }
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
                Seurueen perustiedot:
            </Text>
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account-multiple"
                title="Nimi"
                description={party.seurueen_nimi}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account"
                title="Seurueenjohtaja"
                description={party.seurueen_johatajan_nimi}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account"
                title="Seurueen Tyyppi"
                description={party.seurue_tyyppi_nimi}
            />
            {partyDetailsView(party)}
            <View style={{ paddingVertical: 150 }}></View>
        </ScrollView>
    );
}

type PartyGroupsProps = {
    partyId: number;
    theme: MD3Theme;
    navigation: RootStackScreenProps<"Details">["navigation"];
};

function PartyGroups({ partyId, theme, navigation }: PartyGroupsProps) {
    const result = useFetchQuery<GroupViewQuery[]>(
        "views/?name=mobiili_ryhma_sivu",
        ["Groups"]
    );

    const groupsByPartyId = result.data?.filter(
        (group) => group.seurue_id === partyId
    );

    const PartySummary = ({ groups }: { groups: GroupViewQuery[] }) => {
        const numberOfGroups = groups.length;
        const totalNumberOfMembers = groups.reduce((sum, group) => {
            const numOfMembers = group.jasenia ? group.jasenia : 0;
            return sum + numOfMembers;
        }, 0);

        return (
            <Surface
                elevation={1}
                style={{
                    marginHorizontal: 16,
                    marginVertical: 8,
                    borderRadius: 8,
                    padding: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        variant="titleMedium"
                        style={{
                            color: theme.colors.primary,
                            marginBottom: 12,
                        }}
                    >
                        Yhteenveto
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text variant="bodyLarge">Ryhmien määrä</Text>
                    <Text variant="bodyLarge">{numberOfGroups}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 16,
                        marginBottom: 8,
                    }}
                >
                    <Text variant="bodyLarge">Jäsenien määrä</Text>
                    <Text variant="bodyLarge">
                        {totalNumberOfMembers
                            ? totalNumberOfMembers.toString()
                            : "0"}
                    </Text>
                </View>
            </Surface>
        );
    };

    const PartyGroupList = ({
        groups,
        navigation,
    }: {
        groups: GroupViewQuery[];
        navigation: RootStackScreenProps<"Details">["navigation"];
    }) => {
        if (groups.length === 0) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        variant="bodyLarge"
                        style={{
                            color: theme.colors.outline,
                            fontStyle: "italic",
                        }}
                    >
                        Ei ryhmiä
                    </Text>
                </View>
            );
        } else {
            return groups.map((group) => (
                <View
                    key={group.ryhma_id}
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <Text variant="bodyLarge">{group.ryhman_nimi}</Text>
                    <Text variant="bodyLarge">
                        {(group.osuus_summa ?? 0 / 100).toString()}
                    </Text>
                </View>
            ));
        }
    };

    return (
        <>
            <Divider />
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                    marginBottom: 20,
                }}
            >
                Seurueen ryhmätiedot:
            </Text>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? <ErrorScreen error={result.error} /> : null}
            {result.isSuccess && (
                <>
                    <PartySummary groups={result.data ? result.data : []} />
                    <Surface
                        elevation={1}
                        style={{
                            marginHorizontal: 16,
                            marginVertical: 8,
                            borderRadius: 8,
                            padding: 8,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    color: theme.colors.primary,
                                    marginBottom: 12,
                                }}
                            >
                                Jäsenet
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                marginHorizontal: 16,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    color: theme.colors.outline,
                                    marginBottom: 12,
                                }}
                            >
                                (osuus)
                            </Text>
                        </View>
                        <View style={{ gap: 16 }}>
                            <PartyGroupList
                                groups={groupsByPartyId ?? []}
                                navigation={navigation}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <Button
                                    icon={"plus"}
                                    onPress={() => console.log("pressed")}
                                    compact={true}
                                    disabled={false}
                                    style={{
                                        paddingHorizontal: 8,
                                    }}
                                >
                                    Lisää ryhmä seurueeseen
                                </Button>
                            </View>
                        </View>
                    </Surface>
                </>
            )}
        </>
    );
}

type PartyMemberProps = {
    partyId: number;
    theme: MD3Theme;
    navigation: RootStackScreenProps<"Details">["navigation"];
};

function PartyMembers({ partyId, theme, navigation }: PartyMemberProps) {
    const result = useFetchQuery<MembershipViewQuery[]>(
        `views/?name=mobiili_seurueen_jasenyydet&column=seurue.seurue_id&value=${partyId}`,
        ["seurueen_jasenyydet", partyId]
    );

    const PartySummary = (members: MembershipViewQuery[]) => {
        const numberOfMembers = members.length;
        const totalShare =
            members.reduce((sum, member) => {
                return sum + member.osuus;
            }, 0) / 100;

        return (
            <Surface
                elevation={1}
                style={{
                    marginHorizontal: 16,
                    marginVertical: 8,
                    borderRadius: 8,
                    padding: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        variant="titleMedium"
                        style={{
                            color: theme.colors.primary,
                            marginBottom: 12,
                        }}
                    >
                        Yhteenveto
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text variant="bodyLarge">Jäseniä</Text>
                    <Text variant="bodyLarge">{numberOfMembers}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 16,
                        marginBottom: 8,
                    }}
                >
                    <Text variant="bodyLarge">Kokonaisosuus</Text>
                    <Text variant="bodyLarge">
                        {totalShare ? totalShare.toString() : "0"}
                    </Text>
                </View>
            </Surface>
        );
    };

    const PartyMemberList = (members: MembershipViewQuery[]) => {
        if (members.length === 0) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        variant="bodyLarge"
                        style={{
                            color: theme.colors.outline,
                            fontStyle: "italic",
                        }}
                    >
                        Ei jäseniä
                    </Text>
                </View>
            );
        } else {
            return members.map((member) => (
                <View
                    key={member.jasen_id}
                    style={{
                        flexDirection: "row",
                        marginHorizontal: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <Text variant="bodyLarge">{member.jasenen_nimi}</Text>
                    <Text variant="bodyLarge">
                        {(member.osuus / 100).toString()}
                    </Text>
                </View>
            ));
        }
    };

    return (
        <>
            <Divider />
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                    marginBottom: 20,
                }}
            >
                Seurueen jäsentiedot:
            </Text>
            {result.isLoading ? <ActivityIndicator /> : null}
            {result.isError ? <ErrorScreen error={result.error} /> : null}
            {result.isSuccess && (
                <>
                    {PartySummary(result.data || [])}
                    <Surface
                        elevation={1}
                        style={{
                            marginHorizontal: 16,
                            marginVertical: 8,
                            borderRadius: 8,
                            padding: 8,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    color: theme.colors.primary,
                                    marginBottom: 12,
                                }}
                            >
                                Jäsenet
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                marginHorizontal: 16,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    color: theme.colors.outline,
                                    marginBottom: 12,
                                }}
                            >
                                (osuus)
                            </Text>
                        </View>
                        <View style={{ gap: 16 }}>
                            {PartyMemberList(result.data ?? [])}
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <Button
                                    icon={"plus"}
                                    onPress={() =>
                                        navigation.navigate("Forms", {
                                            type: "Membership",
                                            clear: false,
                                            data: {
                                                seurue_id: partyId,
                                                ryhma_id: null,
                                                jasen_id: undefined,
                                                osuus: 100,
                                                liittyi: undefined,
                                                poistui: undefined,
                                            },
                                        })
                                    }
                                    compact={true}
                                    disabled={false}
                                    style={{
                                        paddingHorizontal: 8,
                                    }}
                                >
                                    Lisää jäsen seurueeseen
                                </Button>
                            </View>
                        </View>
                    </Surface>
                </>
            )}
        </>
    );
}
