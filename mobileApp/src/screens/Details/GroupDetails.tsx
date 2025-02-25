import {
    Text,
    Divider,
    Surface,
    Button,
    ActivityIndicator,
    useTheme,
    MD3Theme,
} from "react-native-paper";
import { RootStackScreenProps } from "../../NavigationTypes";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IconListItem from "../../components/IconListItem";
import { GroupViewQuery, MembershipViewQuery } from "../../types";
import { useAuth } from "../../context/AuthProvider";
import {
    EDIT_RIGHTS_SET,
    WRITE_RIGHTS_SET,
} from "../../utils/authenticationUtils";
import {
    useGroupFormStore,
    useMemberShipFormStore,
} from "../../stores/formStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useIsFocused, useNavigation } from "@react-navigation/native";

type Props = RootStackScreenProps<"Details">;

function GroupDetails({ route, navigation }: Props) {
    const groupId = route.params?.data.ryhma_id as number;
    const result = useFetchQuery<MembershipViewQuery[]>(
        `views/?name=mobiili_ryhman_jasenyydet&column=jakoryhma.ryhma_id&value=${groupId}`,
        ["GroupDetails", groupId]
    );

    const group = getGroup(groupId);
    if (!group) return <Text>Virhe ladatessa välimuistia!</Text>;

    const membershipFormStore = useMemberShipFormStore();

    const { authState } = useAuth();

    const hasWriteRights = !WRITE_RIGHTS_SET.has(authState?.role || "");

    const hasEditRights = authState?.role
        ? EDIT_RIGHTS_SET.has(authState.role)
        : false;

    const theme = useTheme();

    // DO NOT REMOVE!
    // This allows the screen to rerender after returning from edit form
    useIsFocused();

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
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <Text variant="bodyLarge">
                            {(member.osuus / 100).toString()}
                        </Text>
                        {/* <IconButton
                            icon="dots-vertical"
                            iconColor={theme.colors.primary}
                            size={20}
                            // mode="contained-tonal"
                            onPress={() => console.log("Pressed")}
                        /> */}
                    </View>
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
                Ryhmän perustiedot:{group.ryhman_nimi}
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
            <ManagementButtons
                group={group}
                hasEditRights={hasEditRights}
                theme={theme}
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
                {result.isLoading ? <ActivityIndicator /> : null}
                {result.isError ? (
                    <Text style={{ paddingTop: 20 }}>Virhe</Text>
                ) : null}
                {result.isSuccess && (
                    <View style={{ gap: 16 }}>
                        {GroupMembers(result.data || [])}
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Button
                                icon={"plus"}
                                onPress={() => {
                                    navigation.navigate("MembershipForm", {
                                        method: "POST",
                                        id: undefined,
                                        isError: false,
                                        isSuccess: false,
                                        clearFields: false,
                                        errorMessage: "",
                                    });
                                    membershipFormStore.clearForm();
                                    membershipFormStore.updatePartyId(
                                        group.seurue_id
                                    );
                                    membershipFormStore.updateGroupId(
                                        group.ryhma_id
                                    );
                                }}
                                compact={true}
                                disabled={hasWriteRights}
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
            <View style={{ paddingVertical: 150 }}></View>
        </ScrollView>
    );
}

type ManagementButtonsProps = {
    hasEditRights: boolean;
    theme: MD3Theme;
    group: GroupViewQuery;
};

function ManagementButtons({
    hasEditRights,
    theme,
    group,
}: ManagementButtonsProps) {
    const groupFormStore = useGroupFormStore();

    const navigation = useNavigation();

    const handleNavigation = () => {
        groupFormStore.updateGroupName(group.ryhman_nimi);
        groupFormStore.updatePartyId(group.seurue_id);

        navigation.navigate("GroupForm", {
            method: "PUT",
            id: group.ryhma_id,
            isError: false,
            clearFields: false,
            isSuccess: false,
            errorMessage: "",
        });
    };
    return (
        <>
            {hasEditRights ? (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 20,
                        marginHorizontal: 20,
                        gap: 10,
                    }}
                >
                    <Button
                        icon={() => (
                            <MaterialIcons
                                name="edit"
                                size={24}
                                color={theme.colors.onPrimary}
                            />
                        )}
                        mode="contained"
                        style={{ width: "50%" }}
                        onPress={handleNavigation}
                    >
                        Muokkaa
                    </Button>
                    <Button
                        icon={() => (
                            <MaterialIcons
                                name="delete"
                                size={24}
                                color={theme.colors.onPrimary}
                            />
                        )}
                        disabled={true}
                        mode="contained"
                        style={{ width: "50%" }}
                        onPress={() => {}}
                    >
                        Poista
                    </Button>
                </View>
            ) : null}
        </>
    );
}

function getGroup(groupId: number) {
    const queryClient = useQueryClient();
    const groups = queryClient.getQueryData<GroupViewQuery[]>(["Groups"]);
    if (!groups) return undefined;

    const group = groups.find((i) => i.ryhma_id === groupId);
    if (!group) return undefined;

    return group;
}

export default GroupDetails;
