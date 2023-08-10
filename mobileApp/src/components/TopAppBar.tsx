import { Appbar } from 'react-native-paper';

function TopAppBar() {
    return(
        <Appbar.Header>
            {/* <Appbar.BackAction onPress={() => {}} /> */}
            <Appbar.Action icon="account-circle" onPress={() => {}} />
            <Appbar.Content title="Title" />
            <Appbar.Action icon="filter" onPress={() => {}} />
        </Appbar.Header>
    );
};

export default TopAppBar;