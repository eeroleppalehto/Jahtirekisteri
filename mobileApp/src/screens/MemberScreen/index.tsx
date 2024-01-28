import { Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { JasenStateQuery } from "../../types";
import MemberListItem from "./MemberListItem";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    View,
    SectionList,
} from "react-native";
import useFetch from "../../hooks/useFetch";

type Props = MaintenanceTabScreenProps<"Jäsenet">;
// TODO: Refactor to use implementation as ShotScreen

type MembersByLetter = {
    letter: string;
    members: JasenStateQuery[];
};

// Screen for displaying all members in Maintenance tab
function MemberScreen({ navigation, route }: Props) {
    const { data, loading, error, onRefresh } = useFetch<JasenStateQuery[]>(
        "views/?name=jasen_tila_indeksilla"
    );
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

    const membersByTitle = sortedMembers?.reduce((acc, member) => {
        const firstLetter = member.sukunimi.charAt(0).toUpperCase();
        if (!acc.some((item) => item.title === firstLetter)) {
            acc.push({
                title: firstLetter,
                data: [member],
            });
        } else {
            acc.find((item) => item.title === firstLetter)?.data.push(member);
        }
        return acc;
    }, [] as { title: string; data: JasenStateQuery[] }[]);

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
            {membersByTitle && (
                <SectionList
                    sections={membersByTitle}
                    keyExtractor={(item) => item.jasen_id.toString()}
                    renderItem={({ item }) => (
                        <MemberListItem
                            jasen={item}
                            navigation={navigation}
                            key={item.jasen_id}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text
                            variant="titleMedium"
                            style={{
                                color: theme.colors.primary,
                                paddingLeft: 16,
                                paddingTop: 15,
                            }}
                        >
                            {title}
                        </Text>
                    )}
                    stickySectionHeadersEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                        />
                    }
                />
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
