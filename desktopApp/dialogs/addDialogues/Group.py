import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QLabel, QPushButton, QDateEdit, QSpinBox, QComboBox, QLineEdit
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData
from datetime import date
import dialogs.messageModule as msg

class Group(DialogFrame):
    """Creates a dialog to add group to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addGroupDialog.ui", self)

        self.setWindowTitle('Lisää ryhmä')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.addGroupGroupNameLE: QLineEdit = self.addGroupGroupNameLineEdit
        self.addGroupPartyCB: QComboBox = self.addGroupPartyComboBox
        
        self.addGroupAddPushBtn: QPushButton = self.addGroupAddPushButton
        self.addGroupAddPushBtn.clicked.connect(self.addGroup) # Signal
        self.addGroupCancelPushBtn: QPushButton = self.addGroupCancelPushButton
        self.addGroupCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddGroupDialog()
    
    
    def populateAddGroupDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue') # TODO: Make own view to filter members who already have membership
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation, self.addGroupPartyCB, 2, 0)


    def addGroup(self):
        try:
            partyChosenItemIx = self.addGroupPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            groupName = self.addGroupGroupNameLE.text()

            errorCode = 0
            if groupName == '':
                errorCode = 1

            sqlClauseBeginning = "INSERT INTO public.jakoryhma(seurue_id, ryhman_nimi) VALUES("
            sqlClauseValues = f"{partyId}, '{groupName}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Ryhmän lisäys epäonnistui' )

        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä ryhmän nimi kenttä lisätäksesi ryhmän',
                '-'
                )
        else:
            databaseOperation = pgModule.DatabaseOperation()
            databaseOperation.insertRowToTable(self.connectionArguments, sqlClause)
            if databaseOperation.errorCode != 0:
                self.alert(
                    'Vakava virhe',
                    'Tietokantaoperaatio epäonnistui',
                    databaseOperation.errorMessage,
                    databaseOperation.detailedMessage
                    )
            else:
                # Update the page to show new data and clear 
                msg.PopupMessages().successMessage('Lisäys onnistui')
                self.addGroupGroupNameLE.clear()
            

    def closeDialog(self):
        self.close()