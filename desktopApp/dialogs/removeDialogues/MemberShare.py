import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QComboBox, QPushButton
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData
from dialogs.messageModule import PopupMessages as msg

class MemberShare(DialogFrame):
    def __init__(self):
        super().__init__()
        
        loadUi("ui/removeMemberShareDialog.ui", self)
        
        self.setWindowTitle('Poista jäsen jako')
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
        
        # Elements
        self.removeMemberShareCB: QComboBox = self.removeMemberShareComboBox
        self.removeMemberShareCancelPushBtn: QPushButton = self.removeMemberShareCancelPushButton
        self.removeMemberShareCancelPushBtn.clicked.connect(self.closeDialog) # Signal
        self.removeMemberShareSaveBtn: QPushButton = self.removeMemberShareSaveButton
        self.removeMemberShareSaveBtn.clicked.connect(self.removeMemberShare) # Signal
        
        self.populateRemoveGroupShareDialog()
        
        
    def populateRemoveGroupShareDialog(self):
        # Populate the share combo box
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakotapahtuma_jasen_jasen_nimella')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            # Process the data to be shown in the combo box
            
            results = databaseOperation.resultSet
            newResults = []
            
            # Read colums from the result set
            # and generate a string from them to be viewed in the combo box
            for row in results:
                newResults.append((f"Kaato ID: {row[7]} | {row[1]} | {row[3]} | {row[4]}", row[0]))
                
            databaseOperation.resultSet = newResults
            
            self.shotIdList = prepareData.prepareComboBox(
                databaseOperation, self.removeMemberShareCB, 0, 1)
    
    def removeMemberShare(self):
        try:
            shareChosenItemIx = self.removeMemberShareCB.currentIndex()
            shareId = self.shotIdList[shareChosenItemIx]
            
            table = 'public.jakotapahtuma_jasen'
            limit = f"public.jakotapahtuma_jasen.tapahtuma_jasen_id = {shareId}"
        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                'Valitse poistettava jako',
                str(e)
                )
            return
        
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, table, limit)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            msg().successMessage('Jako poistettu')
            self.populateRemoveGroupShareDialog()
        
    def closeDialog(self):
        self.close()
        