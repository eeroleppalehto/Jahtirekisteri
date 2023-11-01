import { List, Menu, Divider } from "react-native-paper";

import { Jasen } from "../../types";

import { MaintenanceTabScreenProps } from "../../NavigationTypes";

type navigationProps = MaintenanceTabScreenProps<"Jäsenet">["navigation"];

interface Props {
    jasen: Jasen;
    navigation: navigationProps;
}

function MemberListItem({ jasen, navigation }: Props) {
    const title = `${jasen.etunimi} ${jasen.sukunimi}`;
    const description = `Jäsennumero: ${jasen.jasen_id} \nKotikunta: ${jasen.postitoimipaikka}`;

    return (
        <>
            <List.Item
                title={title}
                descriptionNumberOfLines={3}
                description={description}
                onPress={() =>
                    navigation.navigate("Details", {
                        type: "Jäsen",
                        data: jasen,
                        title: title,
                    })
                }
            />
            <Divider />
        </>
    );
}

export default MemberListItem;
