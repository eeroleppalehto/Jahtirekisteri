import { List, Menu, Divider } from "react-native-paper";
import { useState } from "react";
import { shotData } from "../../../data/shots";

interface Props {
    shot: shotData;
}

const ListItem = ({ shot }: Props) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const title = `${shot.eläin} ${shot.paino}kg`;
    const description = `Aika: ${shot.pvm} \nPaikka: ${shot.paikka} \nKaataja: ${shot.kaataja}`;

    const optionsListIcon = <List.Icon icon="dots-vertical" />;
    
    let genderIcon: string;

    if (shot.sukupuoli === "Naaras") {
        genderIcon = "gender-female";
    } else if (shot.sukupuoli === "Uros") {
        genderIcon = "gender-male";
    } else {
        genderIcon = "circle-outline";
    }


    const optionsMenu =  
        <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            /* anchor={<List.Item title="Hirvi" onPress={() => setMenuVisible(true)}/>} */
            anchor={optionsListIcon}
            >
            <Menu.Item onPress={() => {}} title="Muokkaa kaatoa..." />
            <Menu.Item onPress={() => {}} title="Lisää tietoja..." />
        </Menu>;

    return (
        <>
            <List.Item 
                title={title}
                descriptionNumberOfLines={3}
                description={description}
                onPress={() => setMenuVisible(true)}
                left={props => <List.Icon {...props} icon={genderIcon} />}
                right={props => optionsMenu}
                />
            <Divider />
        </>
    );
};

export default ListItem;