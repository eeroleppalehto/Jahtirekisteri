import {
    Text,
    Divider,
    Surface,
    Button,
    ActivityIndicator,
    useTheme,
} from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import useFetch from "../../../hooks/useFetch";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IconListItem from "../../components/IconListItem";
import { GroupViewQuery, MembershipViewQuery } from "../../types";

type Props = RootStackScreenProps<"Details">;

function GroupDetails({ route, navigation }: Props) {
    const group = route.params?.data as GroupViewQuery;
    const { data, loading, error } = useFetch<MembershipViewQuery[]>(
        `views/?name=mobiili_jasenyydet&column=jakoryhma.ryhma_id&value=${group.ryhma_id}`
    );

    const theme = useTheme();

    const GroupMembers = (members: MembershipViewQuery[]) => {
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
        <ScrollView>
            <Text
                variant="titleMedium"
                style={{
                    color: theme.colors.primary,
                    paddingLeft: 16,
                    paddingTop: 20,
                }}
            >
                Ryhmän perustiedot:
            </Text>
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account-multiple"
                title="Nimi"
                description={group.ryhman_nimi}
            />
            <IconListItem
                iconSet="MaterialCommunityIcons"
                iconNameMaterialCommunity="account-group"
                title="Seurue"
                description={group.seurueen_nimi}
            />
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
                Ryhmän jäsentiedot:
            </Text>
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
                    <Text variant="bodyLarge">{group.jasenia}</Text>
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
                        {group.osuus_summa ? group.osuus_summa.toString() : "0"}
                    </Text>
                </View>
            </Surface>
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
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <View style={{ gap: 16 }}>
                        {GroupMembers(data || [])}
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Button
                                icon={"plus"}
                                onPress={() => console.log("pressed")}
                                compact={true}
                                disabled={true}
                                style={{
                                    paddingHorizontal: 8,
                                }}
                            >
                                Lisää jäsen ryhmään
                            </Button>
                        </View>
                    </View>
                )}
            </Surface>
        </ScrollView>
    );
}

export default GroupDetails;
