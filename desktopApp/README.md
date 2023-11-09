# Jahtirekisteri Desktop Application

A desktop application written with python and using PyQt5 as it's GUI frame.

To launch the application, you'll need to download and install the dependencies from `requirements.txt` with a virtual environment using `pip install -r requirements.txt`, then run `python3 desktopApp/Jahtirekisteri.py` on Linux or `python desktopApp\Jahtirekisteri.py` on windows.

## File structure

The main app file is `Jahtirekisteri.py` located in `desktopApp/` directory. The directory also contains folders for dialogs `desktopApp/dialogs`, tabs `desktopApp/tabs`, tests `desktopApp/tests` and ui files `desktopapp/ui` in addition to the `requirements.txt` file containing the dependencies and `settings.dat` file containing the PSQL database connection settings.

Files for database connections and data handling are `pgModule.py` and `prepareData.py`.

## Main app

`Jahtirekisteri.py` is used to launch the main application and loads the ui for the GUI from `ui/MultiPageMainWindow.ui`. The tabs containing most of the app's functionality are imported from the `tabs` directory.

## Tabs

The tabs each have their own ui files in the `ui` directory. These tabs are `QWidgets` and contain the code to populate the tabs with results from the database and to handle user inputs for data additions, edits and removals.

## Ui

Ui files are used to form the layout and elements of the GUI. This includes ui's for the main window, tabs and different dialogs.

## Dialogs

Dialogs are used for editing, removing or adding data in the database and to display different messages and alerts to the user. Different dialog files are separated in the directory depending on their function: `dialogs/addDialogue`, `dialogs/editDialogue` and `dialogs/removeDialogue`.

## pgModule

The `pgModule.py` is what's currently connecting to the database and handling fetching result sets, insertions, deletions and updates. This includes methods for function `callFunction` and procedure `callProcedure` calls, single `updateTable` and multiple `updateManyValuesInRow` row updates, insertion `insertRowToTable` and fetching data from tables with `getAllRowsFromTableWithLimit` or without `getAllRowsFromTable` limits.

## Libraries

Most notable libraries:

| Library | Function |
| --- | --- |
| PyQt5 | GUI framework |
| psycopg2 | Database connection / handling |

Specific versions and used modules are listen in `requirements.txt`
