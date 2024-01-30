import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/components/Main";
import { en, registerTranslation } from "react-native-paper-dates";
import { AuthProvider } from "./src/context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./src/baseUrl";

// Register your translation with the react-native-paper-dates library
registerTranslation("en", en);
// As the library does not have a Finnish translation, we need to register our own
// TODO: Make a pull request to the library to add Finnish translation
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

const theme = {
    colors: {
        primary: "rgb(82, 102, 0)",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(212, 237, 127)",
        onPrimaryContainer: "rgb(23, 30, 0)",
        secondary: "rgb(91, 97, 70)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(224, 230, 196)",
        onSecondaryContainer: "rgb(25, 30, 8)",
        tertiary: "rgb(58, 102, 94)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(189, 236, 225)",
        onTertiaryContainer: "rgb(0, 32, 27)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "rgb(254, 252, 244)",
        onBackground: "rgb(27, 28, 23)",
        surface: "rgb(254, 252, 244)",
        onSurface: "rgb(27, 28, 23)",
        surfaceVariant: "rgb(227, 228, 211)",
        onSurfaceVariant: "rgb(70, 72, 60)",
        outline: "rgb(119, 120, 107)",
        outlineVariant: "rgb(199, 200, 184)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(48, 49, 43)",
        inverseOnSurface: "rgb(243, 241, 233)",
        inversePrimary: "rgb(184, 209, 102)",
        elevation: {
            level0: "transparent",
            level1: "rgb(245, 245, 232)",
            level2: "rgb(240, 240, 225)",
            level3: "rgb(235, 236, 217)",
            level4: "rgb(233, 234, 215)",
            level5: "rgb(230, 231, 210)",
        },
        surfaceDisabled: "rgba(27, 28, 23, 0.12)",
        onSurfaceDisabled: "rgba(27, 28, 23, 0.38)",
        backdrop: "rgba(47, 49, 38, 0.4)",
    },
};

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 5000;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Create a client
const queryClient = new QueryClient();

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <NavigationContainer>
                            <Main />
                        </NavigationContainer>
                    </AuthProvider>
                </QueryClientProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
