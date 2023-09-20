# APPLICATON FOR SHOWING SUMMARY DATA ABOUT MEAT GIVEN TO SHARE GROUP
# ====================================================================

# LIBRARIES AND MODULES
# ---------------------

import sys  # Needed for starting the application
from PyQt5.QtWidgets import (QApplication, QMainWindow, QMessageBox, QWidget, QTabWidget, QTableWidget,
QLabel, QPushButton, QPlainTextEdit, QComboBox, QLineEdit, QDateEdit, QMenuBar, QMenu, QAction, QStatusBar, QGridLayout)  # All widgets
from PyQt5 import QtWebEngineWidgets, QtCore # For showing html content
from PyQt5.uic import loadUi
from PyQt5.QtCore import * # FIXME: Imports everything,  change to individual components
from datetime import date
import pgModule
import dialogs.dialogueWindow as dialogueWindow

from tabs.summaryTabWidget import Ui_summaryTabWidget
from tabs.shareTabWidget import Ui_shareTabWidget
from tabs.killTabWidget import Ui_killTabWidget
from tabs.licenseTabWidget import Ui_licenseTabWidget
from tabs.maintenanceTabWidget import Ui_maintenanceTabWidget

# CLASS DEFINITIONS FOR THE APP
# -----------------------------

class MultiPageMainWindow(QMainWindow):

    # Constructor, a method for creating objects from this class
    def __init__(self):
        QMainWindow.__init__(self)

        # Create an UI from the ui file
        loadUi('ui/MultiPageMainWindow.ui', self)

        self.tab = QTabWidget()
        self.tabLayout = QGridLayout()
        self.setCentralWidget(self.tab)
        self.tab.setLayout(self.tabLayout)
        self.tab.addTab(Ui_summaryTabWidget(), 'Yhteenveto')
        self.tab.addTab(Ui_killTabWidget(), 'Kaato')
        self.tab.addTab(Ui_shareTabWidget(), 'Lihanjako')
        self.tab.addTab(Ui_licenseTabWidget(), 'Luvat')
        self.tab.addTab(Ui_maintenanceTabWidget(), 'Ylläpito')

        self.tab.currentChanged.connect(self.tabChanged)

        # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        # UI ELEMENTS TO PROPERTIES
        # -------------------------

        # Create a status bar to show informative messages (replaces print function used in previous exercises)
        self.statusBar = QStatusBar()  # Create a status bar object
        # Set it as the status bar for the main window
        self.setStatusBar(self.statusBar)
        self.statusBar.show()  # Make it visible
        self.setWindowTitle('Jahtirekisteri')

        self.currentDate = date.today()

        # Menu signals
        self.actionServerSettings.triggered.connect(self.openSettingsDialog)
        self.actionManual.triggered.connect(self.openManualDialog)
        self.actionInfo.triggered.connect(self.openInfoDialog)

    # SLOTS
    def alert(self, windowTitle, alertMsg, additionalMsg, details):
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
        
    def tabChanged(self):
        tabIndex = self.tab.currentIndex()
        if tabIndex == 0:
            self.tab.currentWidget().populateSummaryPage()
        elif tabIndex == 1:
            self.tab.currentWidget().populateKillPage()
        elif tabIndex == 2:
            self.tab.currentWidget().populateSharePage()
        elif tabIndex == 3:
            self.tab.currentWidget().populateLicensePage()
        elif tabIndex == 4:
            self.tab.currentWidget().populateMaintenancePage()

    def openManualDialog(self):
        dialog = dialogueWindow.ManualDialog()
        dialog.exec()

    def openInfoDialog(self):
        dialog = dialogueWindow.InfoDialog()
        dialog.exec()

    #SIGNALS
    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

# APPLICATION CREATION AND STARTING
# ----------------------------------


# Check if app will be created and started directly from this file
if __name__ == "__main__":

    # Create an application object
    app = QApplication(sys.argv)
    app.setStyle('Fusion')

    # Create the Main Window object from MultiPageMainWindowe Class and show it on the screen
    appWindow = MultiPageMainWindow()
    appWindow.show()  # This can also be included in the MultiPageMainWindow class
    sys.exit(app.exec_())
