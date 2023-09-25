# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLabel, QPushButton,
                             QComboBox, QTableWidget, QDateEdit,
                             QMainWindow, QApplication, QTableWidgetItem)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

from dialogs.messageModule import PopupMessages as msg

class Share(DialogFrame):
    """Dialog window for editing existing shares"""
    def __init__(self):
        super().__init__()
        
        loadUi("ui/editShareDialog.ui", self)
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
        
        self.setWindowTitle('Muokkaa lihanjakoa')
        
        # Elements
        self.editShareTW: QTableWidget = self.editShareTableWidget
        self.editShareTW.itemClicked.connect(self.onTableClick)
        self.editShareDE: QDateEdit = self.editShareDateEdit
        self.editSharePortionCB: QComboBox = self.editSharePortionComboBox
        self.editShareGroupCB: QComboBox = self.editShareGroupComboBox
        # Label for showing the chosen share and kill id
        self.editShareChosenLbl: QLabel = self.editShareChosenLabel
        
        self.editShareSavePushBtn: QPushButton = self.editShareSavePushButton
        self.editShareSavePushBtn.clicked.connect(self.saveEdit) # Signal
        self.editShareCancelPushBtn: QPushButton = self.editShareCancelPushButton
        self.editShareCancelPushBtn.clicked.connect(self.closeDialog) # Signal
        self.editSharePopulatePushBtn: QPushButton = self.editSharePopulatePushButton
        self.editSharePopulatePushBtn.clicked.connect(self.populateFields) # Signal
        
        # Set initial state of the buttons to false
        self.editShareSavePushBtn.setEnabled(False)
        self.editSharePopulatePushBtn.setEnabled(False)
        
        self.populateEditShareDialog()
    
    
    def populateEditShareDialog(self):
        """Method for populating the edit share dialog with data from the database
        """
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.jakotapahtuma_ryhman_nimella')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareTable(databaseOperation1, self.editShareTW)
            self.editShareTW.setColumnHidden(2, True)
            self.editShareTW.setColumnHidden(5, True)
            
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(self.connectionArguments, 'public.ruhonosa')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.sharePortions = prepareData.prepareComboBox(databaseOperation2, self.editSharePortionCB, 0, 0)
            
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(self.connectionArguments, 'public.jakoryhma')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            self.shareGroupsIdList = prepareData.prepareComboBox(databaseOperation3, self.editShareGroupCB, 2, 0)
    
