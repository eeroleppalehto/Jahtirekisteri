import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/components/Main";
import { en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);
registerTranslation("fi", {
    save: "Tallenna",
    selectSingle: "Valitse päivä",
    selectMultiple: "Valitse päivät",
    selectRange: "Valitse ajanjakso",
    notAccordingToDateFormat: (inputFormat) =>
        `Päivämäärän tulee olla muodossa ${inputFormat}`,
    mustBeHigherThan: (date) => `Täytyy olla myöhemmin kuin ${date}`,
    mustBeLowerThan: (date) => `Täytyy olla ennen kuin ${date}`,
    mustBeBetween: (startDate, endDate) =>
        `Täytyy olla väliltä ${startDate} - ${endDate}`,
    dateIsDisabled: "Päivä on poistettu käytöstä",
    previous: "Edellinen",
    next: "Seuraava",
    typeInDate: "Lisää päivämäärä",
    pickDateFromCalendar: "Valitse päivämäärä kalenterista",
    close: "Sulje",
});

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <NavigationContainer>
                    <Main />
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
