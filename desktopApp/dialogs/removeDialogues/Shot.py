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

class Shot(DialogFrame):
    def __init__(self):
        super().__init__()
        
        loadUi("ui/removeShotDialog.ui", self)
        
        self.setWindowTitle('Poista kaato')
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
        
        # Elements
        self.removeShotCB: QComboBox = self.removeShotComboBox
        
        self.removeShotPushBtn: QPushButton = self.removeShotPushButton
        self.removeShotPushBtn.clicked.connect(self.removeShot) # Signal
        self.removeShotCancelPushBtn: QPushButton = self.removeShotCancelPushButton
        self.removeShotCancelPushBtn.clicked.connect(self.closeDialog) # Signal
        
        # Populate the shot combo box
        self.populateRemoveShotDialog()
        
    def populateRemoveShotDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.kaatoluettelo_indeksilla')
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
            
            # Read colums 0, 1, 2, 3, 4, 5, 6, 7, 9 from each row in the result set
            # and generate a string from them to be viewed in the combo box
            for row in results:
                newResults.append((f"ID: {row[9]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} | {row[6]} | {row[7]}", row[9]))
                
            databaseOperation.resultSet = newResults
            
            self.shotIdList = prepareData.prepareComboBox(
                databaseOperation, self.removeShotCB, 0, 1)
        
    def removeShot(self):
        try:
            shotChosenItemIx = self.removeShotCB.currentIndex()
            shotId = self.shotIdList[shotChosenItemIx]
            
            table = 'public.kaato'
            limit = f"public.kaato.kaato_id = {shotId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
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
            msg().successMessage('Kaato poistettu')
            self.populateRemoveShotDialog()
    
    def closeDialog(self):
        self.close()