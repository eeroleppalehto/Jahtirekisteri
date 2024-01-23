import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Button,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import { useAuth } from "../context/AuthProvider";

interface Props {
    navigation: DrawerNavigationHelpers;
}

// The DrawerContent component is used to render the content of the drawer when user opens it
function DrawerContent({ navigation }: Props) {
    const { authState, onLogout } = useAuth();

    // If user is logged in, loginStatus is true, otherwise false
    const loginStatus = authState?.authenticated
        ? authState?.authenticated
        : false;

    return (
        <DrawerContentScrollView>
            <View style={styles.drawerContent}>
                <ProfileSection
                    loginStatus={loginStatus}
                    navigation={navigation}
                    logout={onLogout}
                />
                <Divider style={{ marginHorizontal: 14, marginVertical: 12 }} />
                <Drawer.Section title="" showDivider={false}>
                    <TouchableRipple onPress={() => {}}>
                        <View style={styles.preference}>
                            <Text>Tumma teema</Text>
                            <View pointerEvents="none">
                                <Switch value={false} />
                            </View>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => {}}>
                        <View style={styles.preference}>
                            <Text>Ohjeet</Text>
                        </View>
                    </TouchableRipple>
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
}

type ProfileSectionProps = {
    loginStatus: boolean;
    navigation: DrawerNavigationHelpers;
    logout?: () => Promise<any>;
};

function ProfileSection({
    loginStatus,
    navigation,
    logout,
}: ProfileSectionProps) {
    const theme = useTheme();
    switch (loginStatus) {
        case true:
            return (
                <>
                    <View style={styles.userInfoSection}>
                        <Avatar.Icon size={50} icon={"account"} />
                        <Title style={styles.title}>Miika Hiivola</Title>
                        <Caption style={styles.caption}>Käyttäjänimi</Caption>
                    </View>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account-outline"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Profiili"
                        onPress={() => navigation.navigate("Profile")}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="logout"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Kirjaudu ulos"
                        onPress={() => logout?.()}
                    />
                </>
            );
        case false:
            return (
                <View
                    style={{
                        ...styles.userInfoSection,
                        gap: 10,
                        paddingTop: 20,
                        paddingRight: 20,
                    }}
                >
                    <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                        Et ole kirjautunut sisään
                    </Text>
                    <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.outline }}
                    >
                        Kirjaudu sisään nähdäksesi profiilisi ja muut tiedot
                    </Text>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate("Login")}
                    >
                        Kirjaudu sisään
                    </Button>
                </View>
            );
        default:
            return (
                <View
                    style={{
                        ...styles.userInfoSection,
                        gap: 10,
                        paddingTop: 20,
                        paddingRight: 20,
                    }}
                >
                    <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                        Et ole kirjautunut sisään
                    </Text>
                    <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.outline }}
                    >
                        Kirjaudu sisään nähdäksesi profiilisi ja muut tiedot
                    </Text>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate("Login")}
                    >
                        Kirjaudu sisään
                    </Button>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        marginTop: 20,
        fontWeight: "bold",
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    drawerSection: {
        marginTop: 15,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    button: {
        // marginHorizontal: 10,
        // marginRight: 10,
    },
});

export default DrawerContent;
