import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import jasenService from "../../services/jasenService";
import { Jasen } from "../../types";
import MemberListItem from "./MemberListItem";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import useFetch from "../../../hooks/useFetch";

type Props = MaintenanceTabScreenProps<"Jäsenet">;
// TODO: Refactor to use implementation as ShotScreen

type MembersByLetter = {
    letter: string;
    members: Jasen[];
};

// Screen for displaying all members in Maintenance tab
function MemberScreen({ navigation, route }: Props) {
    const { data, loading, error } = useFetch<Jasen[]>("members");
    const [scrollValue, setScrollValue] = useState(0);

    const theme = useTheme();

    const onScroll = ({
        nativeEvent,
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setScrollValue(currentScrollPosition);
    };

    // Sort members by last name
    const sortedMembers = data?.sort((a, b) => {
        const completeNameA = `${a.sukunimi} ${a.etunimi}`;
        const completeNameB = `${b.sukunimi} ${b.etunimi}`;

        if (completeNameA < completeNameB) {
            return -1;
        }
        if (completeNameA > completeNameB) {
            return 1;
        }
        return 0;
    });

    // Group members by first letter of last name
    const membersByLetter = sortedMembers?.reduce((acc, member) => {
        const firstLetter = member.sukunimi.charAt(0).toUpperCase();
        if (!acc.some((item) => item.letter === firstLetter)) {
            acc.push({
                letter: firstLetter,
                members: [member],
            });
        } else {
            acc.find((item) => item.letter === firstLetter)?.members.push(
                member
            );
        }
        return acc;
    }, [] as { letter: string; members: Jasen[] }[]);

    const MemberContent = ({ letter, members }: MembersByLetter) => {
        return (
            <View key={letter} style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text
                        variant="titleMedium"
                        style={{
                            color: theme.colors.primary,
                            paddingLeft: 16,
                            paddingTop: 30,
                        }}
                    >
                        {letter}
                    </Text>
                </View>
                <View style={{ flex: 7, flexDirection: "column" }}>
                    {members.map((member) => (
                        <MemberListItem
                            key={member.jasen_id}
                            jasen={member}
                            navigation={navigation}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size={"large"} style={{ paddingTop: 50 }} />
            ) : (
                <>
                    <FlatList
                        data={membersByLetter}
                        keyExtractor={(item) => item.letter}
                        renderItem={({ item }) => (
                            <MemberContent
                                letter={item.letter}
                                members={item.members}
                            />
                        )}
                        onScroll={onScroll}
                    />
                </>
            )}
            <FloatingNavigationButton
                scrollValue={scrollValue}
                type="jäsen"
                label="Lisää jäsen  "
            />
        </>
    );
}

export default MemberScreen;
