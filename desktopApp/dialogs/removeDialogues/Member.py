import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QComboBox, QLabel, QPushButton
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import dialogs.messageModule as msg
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Member(DialogFrame):
    """Creates a dialog to remove member from database"""
    # TODO: Change from using delete from database to changing members status to deactive('poistunut')
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removeMemberDialog.ui", self)

        self.setWindowTitle('Poista jäsen')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.removeMemberCB: QComboBox = self.removeMemberComboBox
        
        self.removeMemberPushBtn: QPushButton = self.removeMemberPushButton
        self.removeMemberPushBtn.clicked.connect(self.removeMember) # Signal
        self.removeMemberCancelPushBtn: QPushButton = self.removeMemberCancelPushButton
        self.removeMemberCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        # Populate the member combo box
        self.populateRemoveMemberDialog()

    

    def populateRemoveMemberDialog(self):
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
                databaseOperation2, self.removeMemberCB, 1, 0)
    

    def removeMember(self):
        try:
            memberChosenItemIx = self.removeMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]
            
            table = 'public.jasen'
            limit = f"public.jasen.jasen_id = {memberId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Poisto epäonnistui' )
        
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.jasen_liitokset')
        memberConnections = databaseOperation1.resultSet
        alert = 0

        for id in memberConnections:
            if id[0] == memberId:
                connectionWarning = 'Et voi poistaa jäsentä joka on lisätty toiseen tauluun'
                alert = 1
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen',connectionWarning)
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
                msg.PopupMessages().successMessage('Poisto onnistui')
                self.populateRemoveMemberDialog()

    def closeDialog(self):
        self.close()