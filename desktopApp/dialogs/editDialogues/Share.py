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
