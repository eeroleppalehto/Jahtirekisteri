import { List } from "react-native-paper";
import ListItem from "./ListItem";
import { shots } from "../../../data/shots";

const SharePage = () => {

    const items = shots.map((item) => (<ListItem key={item.id} shot={item} />));

    return (
        <List.Section>
            {/* <List.Subheader>Some title</List.Subheader> */}
            {items}
        </List.Section>
    );
};

export default SharePage;