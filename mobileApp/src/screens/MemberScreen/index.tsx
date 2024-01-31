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
    SectionList,
} from "react-native";
import { useFetchQuery } from "../../hooks/useTanStackQuery";
import { ErrorScreen } from "../ErrorScreen";
import { DefaultActivityIndicator } from "../../components/DefaultActivityIndicator";

type Props = MaintenanceTabScreenProps<"Jäsenet">;

// Screen for displaying all members in Maintenance tab
function MemberScreen({ navigation, route }: Props) {
    const result = useFetchQuery<JasenStateQuery[]>(
        "views/?name=jasen_tila_indeksilla",
        ["Members"]
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
    const sortedMembers = result.isSuccess
        ? result.data.sort((a, b) => {
              const completeNameA = `${a.sukunimi} ${a.etunimi}`;
              const completeNameB = `${b.sukunimi} ${b.etunimi}`;

              if (completeNameA < completeNameB) {
                  return -1;
              }
              if (completeNameA > completeNameB) {
                  return 1;
              }
              return 0;
          })
        : undefined;

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

    return (
        <>
            {result.isLoading ? <DefaultActivityIndicator /> : null}
            {result.isError ? (
                <ErrorScreen error={result.error} reload={result.refetch} />
            ) : null}
            {membersByTitle ? (
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
                            refreshing={result.isLoading}
                            onRefresh={result.refetch}
                        />
                    }
                />
            ) : null}
            <FloatingNavigationButton
                scrollValue={scrollValue}
                type="jäsen"
                label="Lisää jäsen  "
            />
        </>
    );
}

export default MemberScreen;
