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

class GroupShare(DialogFrame):
    def __init__(self):
        super().__init__()
        
        loadUi("ui/removeGroupShareDialog.ui", self)
        
        self.setWindowTitle('Poista jako')
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
        
        # Elements
        self.removeGroupShareCB: QComboBox = self.removeGroupShareComboBox
        self.removeGroupShareCancelPushBtn: QPushButton = self.removeGroupShareCancelPushButton
        self.removeGroupShareCancelPushBtn.clicked.connect(self.closeDialog) # Signal
        self.removeGroupShareSaveBtn: QPushButton = self.removeGroupShareSaveButton
        self.removeGroupShareSaveBtn.clicked.connect(self.removeGroupShare) # Signal
        
        self.populateRemoveGroupShareDialog()
        
        
    def populateRemoveGroupShareDialog(self):
        # Populate the share combo box
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakotapahtuma_ryhman_nimella')
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
                databaseOperation, self.removeGroupShareCB, 0, 1)
    
    def removeGroupShare(self):
        try:
            shareChosenItemIx = self.removeGroupShareCB.currentIndex()
            shareId = self.shotIdList[shareChosenItemIx]
            
            table = 'public.jakotapahtuma'
            limit = f"public.jakotapahtuma.tapahtuma_id = {shareId}"
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
        