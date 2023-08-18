import { List, Menu, Divider } from "react-native-paper";

import jasenService from "../../service/jasenService";
import { Jasen } from "../../types";

interface Props {
    jasen: Jasen;
    navigation: any;
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
                onPress={() => navigation.navigate('Details', {
                    type: 'Jäsen',
                    jasen
                })}
                />
            <Divider />
        </>
    );
}

export default MemberListItem;