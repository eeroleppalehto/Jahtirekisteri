import { List, Menu, Divider } from "react-native-paper";
//import { useState } from "react";

import jasenService from "../../service/jasenService";
import { Jasen } from "../../types";

interface Props {
    jasen: Jasen;
    navigation: any;
}

function MemberListItem({ jasen, navigation }: Props) {
    //const [menuVisible, setMenuVisible] = useState(false);

    const title = `${jasen.etunimi} ${jasen.sukunimi}`;
    const description = `Jäsennumero: ${jasen.jasen_id} \nKotikunta: ${jasen.postitoimipaikka}`;

    return (
        <>
            <List.Item 
                title={title}
                descriptionNumberOfLines={3}
                description={description}
                onPress={() => navigation.navigate('Details')}
                //right={props => optionsMenu}
                />
            <Divider />
        </>
    );
}

export default MemberListItem;