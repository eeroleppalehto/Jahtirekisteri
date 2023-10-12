import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QComboBox, QLabel, QPushButton
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Party(DialogFrame):
    """Creates a dialog to remove party from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removePartyDialog.ui", self)

        self.setWindowTitle('Poista seurue')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.removePartyCB = self.removePartyComboBox
        
        
        self.removePartyRemovePushBtn = self.removePartyRemovePushButton
        self.removePartyRemovePushBtn.clicked.connect(self.removeParty) # Signal
        self.removePartyCancelPushBtn = self.removePartyCancelPushButton
        self.removePartyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateRemovePartyDialog()
    

    def populateRemovePartyDialog(self):
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation2, self.removePartyCB, 2, 0)

    def removeParty(self):
        try:
            partyChosenItemIx = self.removePartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            
            table = 'public.seurue'
            limit = f"public.seurue.seurue_id = {partyId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.seurue_liitokset')
        partyConnections = databaseOperation1.resultSet
        alert = 0

        for id in partyConnections:
            if id[0] == partyId:
                connectionWarning = 'Et voi poistaa seuruetta joka on lisätty toiseen tauluun'
                alert = 1
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen', connectionWarning)
                break

        if alert != 1:
            databaseOperation2 = pgModule.DatabaseOperation()
            databaseOperation2.deleteFromTable(self.connectionArguments, table, limit)
            if databaseOperation2.errorCode != 0:
                self.alert(
                    'Vakava virhe',
                    'Tietokantaoperaatio epäonnistui',
                    databaseOperation2.errorMessage,
                    databaseOperation2.detailedMessage
                    )
            else:
                # Update the page to show new data and clear 
                success = SuccessfulOperationDialog()
                success.exec()
                self.populateRemovePartyDialog()

    def closeDialog(self):
        self.close()