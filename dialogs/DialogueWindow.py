import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QMessageBox, QTextBrowser, QLabel, QPushButton, QSpinBox,
QLineEdit, QTextEdit, QComboBox, QDateEdit, QTableWidget, QMainWindow, QApplication)
from PyQt5.uic import loadUi
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class DialogFrame(QDialog):
    """A Parent Class that has alert method implemented and 
    database connection attribute defined"""
    def __init__(self):
        super().__init__()

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
    
        self.currentDate = date.today()

    def alert(self, windowTitle,alertMsg, additionalMsg, details):
        """Creates a message box for critical errors

        Args:
            windowTitle (str): Title of the message box
            alertMsg (str): Basic information about the error in Finnish
            additionalMsg (str): Additional information about the error in Finnish
            details (str): Technical details in English (from psycopg2)
        """

        alertDialog = QMessageBox() # Create a message box object
        alertDialog.setWindowTitle(windowTitle) # Add appropriate title to the message box
        alertDialog.setIcon(QMessageBox.Critical) # Set icon to critical
        alertDialog.setText(alertMsg) # Basic information about the error in Finnish
        alertDialog.setInformativeText(additionalMsg) # Additional information about the error in Finnish
        alertDialog.setDetailedText(details) # Technical details in English (from psycopg2)
        alertDialog.setStandardButtons(QMessageBox.Ok) # Only OK is needed to close the dialog
        alertDialog.exec_() # Open the message box
    
class SaveDBSettingsDialog(QDialog):
    """Creates a dialog to save database settings"""

    # Constructor
    def __init__(self):
        super().__init__()

        loadUi("ui/saveDBSettingsDialog.ui", self)

        self.setWindowTitle('Tietokantapalvelimen asetukset')

        # Elements
        self.hostLE = self.hostLineEdit
        self.portSB = self.portSpinBox
        self.databaseLE = self.databaseLineEdit
        self.userLE = self.userLineEdit
        self.passwordLE = self.passwordLineEdit
        self.cancelPB = self.cancelPushButton
        self.savePB = self.savePushButton
        # Signals
        self.cancelPB.clicked.connect(self.closeDialog)
        self.savePB.clicked.connect(self.saveSettings)
    

        # Set values of elements according to the current settings
        # Create an object to use setting methods

        self.databaseOperation = pgModule.DatabaseOperation() # Needed in slots -> self # FIXME: Uncomment + add pgModule
        currentSettings = self.databaseOperation.readDatabaseSettingsFromFile(
            'connectionSettings.dat')  # Read current settings, needed only in the constructor
        self.hostLE.setText(currentSettings['server'])  # Server's host name
        # Port number, spin box uses integer values
        self.portSB.setValue(int(currentSettings['port']))
        self.databaseLE.setText(currentSettings['database'])
        self.userLE.setText(currentSettings['user'])
        self.passwordLE.setText(currentSettings['password'])


    # Slots

    # Peru button closes the dialog
    def closeDialog(self):
        self.close()

    # Tallenna button saves modified settings to a file and closes the dialog
    def saveSettings(self):
        # TODO: Finish
        server = self.hostLE.text()
        # Port is string in the settings file, integer in the spin box
        port = str(self.portSB.value())
        database = self.databaseLE.text()
        user = self.userLE.text()
        password = self.passwordLE.text()



        # Build new connection arguments
        newSettings = self.databaseOperation.createConnectionArgumentDict(
            database, user, password, server, port)
        
        # Save arguments to a json file
        self.databaseOperation.saveDatabaseSettingsToFile(
            'connectionSettings.dat', newSettings)
        self.close()

class TestMainWindow(QMainWindow):
    """Main Window for testing dialogs."""

    def __init__(self):
        super().__init__()

        self.setWindowTitle('Pääikkuna dialogien testaukseen')

        # Add dialogs to be tested here and run them as follows:
        saveDBSettingsDialog = SaveDBSettingsDialog()
        saveDBSettingsDialog.exec()

class SuccessfulOperationDialog(QDialog):
    def __init__(self):

        super().__init__()

        loadUi("ui/successfulOperationDialog.ui", self)

        self.setWindowTitle('Onnistui!')

        self.successOkPushBtn = self.successOkPushButton
        self.successOkPushBtn.clicked.connect(self.closeDialog)
    
    def closeDialog(self):
        self.close()

class ManualDialog(QDialog):
    def __init__(self):

        super().__init__()

        loadUi("ui/manualDialog.ui", self)

        self.setWindowTitle('Ohjeet')

        self.manualTB = self.manualTextBrowser
        # self.manualTB.openExternalLinks()

class InfoDialog(QDialog):
    def __init__(self):

        super().__init__()

        loadUi("ui/infoDialog.ui", self)

        self.setWindowTitle('Tietoja')

        # self.infoTB = self.infoTextBrowser

# Some tests
if __name__ == "__main__":

    # Create a testing application
    testApp = QApplication(sys.argv)

    # Create a main window for testing a dialog
    testMainWindow = TestMainWindow()
    testMainWindow.show()

    # Run the testing application
    testApp.exec()