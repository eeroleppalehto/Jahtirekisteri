import { List } from "react-native-paper";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import jasenService from "../../services/jasenService";
import { Jasen } from "../../types";
import MemberListItem from "./MemberListItem";
import { MaintenanceTabScreenProps } from "../../NavigationTypes";
import FloatingNavigationButton from "../../components/FloatingNavigationButton";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

type Props = MaintenanceTabScreenProps<"Jäsenet">;

function MemberScreen({ navigation, route }: Props) {
    const [members, setMembers] = useState<Jasen[]>([]);
    const [scrollValue, setScrollValue] = useState(0);

    useEffect(() => {
        const fetchMembers = async () => {
            const members = await jasenService.getAll();
            setMembers(members);
        };
        void fetchMembers();
    }, []);

    useEffect(() => {
        if (route.params?.data) {
            const newMember = route.params.data;
            setMembers([...members, newMember]);
        }
    }, [route.params?.data]);

    const onScroll = ({
        nativeEvent,
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setScrollValue(currentScrollPosition);
    };

    return (
        <>
            <ScrollView onScroll={onScroll}>
                <List.Section>
                    {members.map((member) => (
                        <MemberListItem
                            key={member.jasen_id}
                            jasen={member}
                            navigation={navigation}
                        />
                    ))}
                </List.Section>
            </ScrollView>
            <FloatingNavigationButton
                scrollValue={scrollValue}
                type="jäsen"
                label="Lisää jäsen  "
            />
        </>
    );
}

export default MemberScreen;
