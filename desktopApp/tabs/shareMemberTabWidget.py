from PyQt5.QtWidgets import (QWidget, QScrollArea, QMessageBox, QTableWidget, 
                             QTableWidgetItem, QDateEdit, QComboBox, QPushButton, QLabel)
from PyQt5 import QtCore
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.uic import loadUi
from datetime import date
import pgModule
import prepareData
import figures
import party

import dialogs.dialogueWindow as dialogueWindow


class Ui_shareMemberTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_shareMemberTabWidget, self).__init__()
        loadUi('ui/shareMemberTab.ui', self)
        #TODO: Do everything lol
    
        self.currentDate = date.today()

        self.shareKillsMemberTW: QTableWidget= self.shareKillsTableWidget
        self.shareDE: QDateEdit = self.shareDateEdit
        self.sharePortionCB: QComboBox = self.portionComboBox
        self.shareMemberCB: QComboBox = self.memberComboBox
        self.shareSavePushBtn: QPushButton = self.shareSavePushButton
        # self.shareSavePushBtn.clicked.connect(self.saveShare) # Signal
        self.sharedPortionsTW: QTableWidget = self.shareSharedPortionsTableWidget

        self.chosenItemLbl: QLabel = self.chosenItemLabel

        self.shareSankeyWebView: QWebEngineView = self.shareSankeyWebEngineView

        # Signal when the user clicks an item on shareKillsTW
        # self.shareKillsMemberTW.itemClicked.connect(self.onShareKillTableClick)

                # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        # self.populateSharePage()
        
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
