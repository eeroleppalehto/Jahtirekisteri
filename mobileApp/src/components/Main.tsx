import { StatusBar } from "expo-status-bar"
import BottomNav from "./BottomNav";
import TopAppBar from "./TopAppBar";

function Main() {
    return (
        <>
            <StatusBar style="auto" />
            <TopAppBar />
            <BottomNav />
        </>
    )
}

export default Main;