import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QLabel, QPushButton, QDateEdit, QSpinBox, QComboBox, QLineEdit
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Party(DialogFrame):
    """Creates a dialog to add party to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addPartyDialog.ui", self)

        self.setWindowTitle('Lisää seurue')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.addPartyNameLE: QLineEdit = self.addPartyNameLineEdit
        self.addPartyLeaderCB: QComboBox = self.addPartyLeaderComboBox
        self.addPartyTypeCB: QComboBox = self.addPartyTypeComboBox
        
        self.addPartyAddPushBtn: QPushButton = self.addPartyAddPushButton
        self.addPartyAddPushBtn.clicked.connect(self.addParty) # Signal
        self.addPartyCancelPushBtn: QPushButton = self.addPartyCancelPushButton
        self.addPartyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddPartyDialog()
    
    def populateAddPartyDialog(self):
        """Method for populating the dialog windows combo boxes with data from the database
        """
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.nimivalinta')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.memberIdList = prepareData.prepareComboBox(
                databaseOperation2, self.addPartyLeaderCB, 1, 0)
            
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue_tyyppi')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            self.partyTypeList = prepareData.prepareComboBox(
                databaseOperation3, self.addPartyTypeCB, 1, 0)

    def addParty(self):
        """Method for adding a party to the database when the push button is clicked on the dialog window
        """
        
        try:
            companyId = 1
            partyName = self.addPartyNameLE.text()

            memberChosenItemIx = self.addPartyLeaderCB.currentIndex()
            partyLeaderId = self.memberIdList[memberChosenItemIx]
            
            chosenPartyTypeIx = self.addPartyTypeCB.currentIndex()
            partyTypeId = self.partyTypeList[chosenPartyTypeIx]

            
            if partyName == '':
                self.alert(
                    'Vakava virhe',
                    'Et voi lisätä tyhjää kenttää',
                    'Täytä seurueen nimi kenttä lisätäksesi seurueen',
                    '-'
                    )
                return

            sqlClauseBeginning = "INSERT INTO public.seurue(seura_id, seurueen_nimi, jasen_id, seurue_tyyppi_id) VALUES("
            sqlClauseValues = f"{companyId}, '{partyName}', {partyLeaderId}, {partyTypeId}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return

        
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
            # Update the page to show new data and clear the line edit
            success = SuccessfulOperationDialog()
            success.exec()
            self.addPartyNameLE.clear()

    def closeDialog(self):
        self.close()
