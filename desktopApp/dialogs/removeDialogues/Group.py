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

class Group(DialogFrame):
    """Creates a dialog to remove group from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removeGroupDialog.ui", self)

        self.setWindowTitle('Poista ryhmä')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.removeGroupCB: QComboBox = self.removeGroupComboBox
        
        
        self.removeGroupRemovePushBtn: QPushButton = self.removeGroupRemovePushButton
        self.removeGroupRemovePushBtn.clicked.connect(self.removeGroup) # Signal
        self.removeGroupCancelPushBtn: QPushButton = self.removeGroupCancelPushButton
        self.removeGroupCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateRemoveGroupDialog()
    

    def populateRemoveGroupDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation, self.removeGroupCB, 2, 0)
    
    def removeGroup(self):
        try:
            groupChosenItemIx = self.removeGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]
            
            table = 'public.jakoryhma'
            limit = f"public.jakoryhma.ryhma_id = {groupId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Poisto epäonnistui' )

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.jakoryhma_liitokset')
        groupConnections = databaseOperation1.resultSet
        alert = 0

        for id in groupConnections:
            if id[0] == groupId:
                connectionWarning = 'Et voi poistaa ryhmää joka on lisätty toiseen tauluun'
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
                self.populateRemoveGroupDialog()

    def closeDialog(self):
        self.close()