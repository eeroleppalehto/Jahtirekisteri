# Mobile Application

## Installation

To get this project up and running on your local machine, follow these steps:

-   Install Node.js from <https://nodejs.org/en/download/> if you don't have it already.
-   You can either use the Expo Go app on your phone or an Android emulator to run the app. To use an Android emulator, you need to install Android Studio from <https://developer.android.com/studio>. You can also use the iOS simulator if you have a Mac. To run the iOS simulator, you need to install Xcode from <https://apps.apple.com/us/app/xcode/id497799835?mt=12>.
-   Once previous steps have been done, run the following command to install the dependencies for the project `npm install`

## Manual

To run the app, run the following command: `npm start`. Press `a` to run the app on an Android emulator or `i` to run the app on an iOS simulator. If you want to run the app on your phone, you need to install the Expo Go app from either Play Store or App Store and scan the QR code that appears in the terminal. Note on iOS: You need to read the QR code with the camera app and then open the link.

## Build

To build the apk-file of the application install the Expo CLI by running the following command: `npm install -g eas-cli`. After the installation you need to login to Expo by running the following command: `eas login`.

To build the app run `eas build -p android --profile preview`. This will build the app in expo's servers and you can download the apk-file from the link that is provided after the build is done. If you're using Mac or Linux, you can also build the app locally by adding the `--local` flag to the command.

## File structure

The `src` folder contains all the code for the app. The `assets` folder contains all the images and fonts used in the app. The `screen` directory is used to store all the screen views used in the app. For singular components, the `components` directory is used which holds for example navigation and app bar components among others.

The `service` directory contains all the services used in the app.For miscellaneous utilities, the `utils` directory is used.

## Modules

Short description of the modules:

| Module             | Description                |
| ------------------ | -------------------------- |
| App.tsx            | Main component for the app |
| components         | Directory for components   |
| screens            | Directory for screens      |
| services           | Directory for services     |
| utils              | Directory for utilities    |
| NavigationTypes.ts | Types for navigation       |
| types.ts           | Types for the app          |

## Libraries

The app uses the following libraries:

| Library            | Description             | Link                                                      |
| ------------------ | ----------------------- | --------------------------------------------------------- |
| React Native       | Framework               | <https://reactnative.dev/>                                |
| Expo               | Development environment | <https://expo.io/>                                        |
| React Navigation   | Navigation              | <https://reactnavigation.org/>                            |
| React Native Paper | UI library              | <https://callstack.github.io/react-native-paper/>         |
| Victory Native     | Chart library           | <https://formidable.com/open-source/victory/docs/native/> |
