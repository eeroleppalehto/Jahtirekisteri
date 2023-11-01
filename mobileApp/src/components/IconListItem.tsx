import { Text, MD3Colors } from "react-native-paper";
import { View, StyleSheet } from "react-native";

type Props = {
    icon: React.JSX.Element | null;
    title: string;
    description: string | null;
};

function IconListItem({ icon, title, description }: Props) {
    const DescriptionText = description ? (
        <Text variant="bodyMedium" style={{ color: MD3Colors.neutral40 }}>
            {description}
        </Text>
    ) : (
        <Text
            variant="bodyMedium"
            style={{ color: MD3Colors.neutral40, fontStyle: "italic" }}
        >
            Ei tietoja
        </Text>
    );

    const iconStyle = icon ? styles.icon : styles.emptyIcon;

    return (
        <View style={styles.container}>
            <View style={iconStyle}>{icon}</View>
            <View style={{}}>
                <Text variant="bodyLarge">{title}</Text>
                {DescriptionText}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
    },
    icon: {
        paddingTop: 5,
        paddingLeft: 14,
        paddingRight: 16,
    },
    emptyIcon: {
        paddingTop: 5,
        paddingLeft: 26,
        paddingRight: 28,
    },
    // textContainer: {
    //     flex: 1,
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     paddingRight: 5,
    // },
    // upperText: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // },
    // bottomText: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // },
});

export default IconListItem;
