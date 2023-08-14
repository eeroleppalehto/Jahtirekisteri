import { StatusBar } from "expo-status-bar"
import BottomNav from "./BottomNav";
import TopAppBar from "./TopAppBar";
import RootNav from "./RootNav";

function Main() {
    return (
        <>
            <StatusBar style="auto" />
            <RootNav />
            {/* <TopAppBar />
            <BottomNav /> */}
        </>
    )
}

export default Main;