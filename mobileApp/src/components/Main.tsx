import { StatusBar } from "expo-status-bar"
import BottomNav from "./BottomNav";
import TopAppBar from "./TopAppBar";

const Main = () => {
    return (
        <>
            <StatusBar style="auto" />
            <TopAppBar />
            <BottomNav />
        </>
    )
};

export default Main;