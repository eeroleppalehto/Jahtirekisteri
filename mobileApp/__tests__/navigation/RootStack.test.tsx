jest.useFakeTimers();
import {
    screen,
    render,
    fireEvent,
    userEvent,
} from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "../../src/testComponents/RootStack";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

describe("RootStack", () => {
    beforeEach(() => {
        render(
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
        );
    });

    test("RootStack renders correctly", () => {
        expect(screen.getByText("Lisää kaato")).toBeTruthy();
    });

    // test("Changes to MaintenanceNav when 'Ylläpito' is pressed", async () => {
    //     render(
    //         <NavigationContainer>
    //             <RootStack />
    //         </NavigationContainer>
    //     );

    //     const user = userEvent.setup({
    //         delay: 3000,
    //     });

    //     // fireEvent.press(screen.getByTestId("TestTab"));
    //     const tabButton = await screen.findByText("Lisää kaato");

    //     // fireEvent(tabButton, "press");
    //     user.press(tabButton);
    //     user.press(tabButton);

    //     const addButton = await screen.findByText("Tallenna");

    //     expect(addButton).toBeDefined();
    // });
});
