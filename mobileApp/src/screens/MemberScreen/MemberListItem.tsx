import {
    List,
    Divider,
    TouchableRipple,
    Text,
    Avatar,
    useTheme,
} from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { JasenStateQuery } from "../../types";

import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type navigationProps = MaintenanceTabScreenProps<"Jäsenet">["navigation"];

interface Props {
    jasen: JasenStateQuery;
    navigation: navigationProps;
}

function MemberListItem({ jasen, navigation }: Props) {
    const theme = useTheme();
    const title = `${jasen.sukunimi} ${jasen.etunimi}`;

    const TextAvatar = (firstname: string, lastname: string) => {
        const firstLetter = firstname.charAt(0).toUpperCase();
        const secondLetter = lastname.charAt(0).toUpperCase();
        return (
            <Avatar.Text
                size={40}
                label={`${secondLetter}${firstLetter}`}
                labelStyle={{ fontSize: 16 }}
            />
        );
    };

    return (
        <>
            <TouchableRipple
                onPress={() =>
                    navigation.navigate("Details", {
                        type: "Member",
                        data: jasen,
                        title: title,
                    })
                }
                style={{ borderRadius: 5 }}
            >
                <View style={styles.container}>
                    {TextAvatar(jasen.etunimi, jasen.sukunimi)}
                    <View style={styles.textContainer}>
                        <Text variant="bodyLarge" style={styles.upperText}>
                            {title}
                        </Text>
                        <View style={styles.bottomText}>
                            <Text
                                variant="bodyMedium"
                                style={{
                                    ...styles.bottomText,
                                    color: theme.colors.outline,
                                }}
                            >
                                {jasen.tila}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableRipple>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingLeft: 50,
        gap: 15,
    },
    avatar: {
        paddingTop: 5,
        paddingLeft: 10,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingRight: 15,
    },
    upperText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 14,
        paddingRight: 15,
    },
    divider: {
        marginHorizontal: 50,
    },
});

export default MemberListItem;
