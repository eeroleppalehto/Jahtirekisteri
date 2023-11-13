import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QComboBox, QLabel, QPushButton
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData
from dialogs.messageModule import PopupMessages as msg

class Membership(DialogFrame):
    """Creates a dialog to remove membership from database"""
    def __init__(self):

        super().__init__()

        loadUi("ui/removeMembershipDialog.ui", self)

        self.setWindowTitle('Poista jäsenyys')
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')
        
        # Elements
        self.removeMembershipCB: QComboBox = self.removeMembershipComboBox
        
        self.removeMembershipPushBtn: QPushButton = self.removeMembershipPushButton
        self.removeMembershipPushBtn.clicked.connect(self.removeMembership) # Signal
        self.removeMembershipCancelPushBtn: QPushButton = self.removeMembershipCancelPushButton
        self.removeMembershipCancelPushBtn.clicked.connect(self.closeDialog) # Signal
        
        # Populate the membership combo box
        self.populateRemoveMembershipDialog()
        
    def populateRemoveMembershipDialog(self):
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.jasenyys_nimella_ryhmalla')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            # Process the data to be shown in the combo box
            
            results = databaseOperation2.resultSet
            newResults = []
            
            # Read colums 0, 4 and 7 from each row in the result set
            # and generate a string from them to be viewed in the combo box
            for row in results:
                newResults.append((f"{row[0]} | {row[4]} | Osuus: {row[7]}", row[1]))
                
            databaseOperation2.resultSet = newResults
            
            self.membershipIdList = prepareData.prepareComboBox(
                databaseOperation2, self.removeMembershipCB, 0, 1)
            
    def removeMembership(self):
        try:
            membershipChosenItemIx = self.removeMembershipCB.currentIndex()
            membershipId = self.membershipIdList[membershipChosenItemIx]
            
            table = 'public.jasenyys'
            limit = f"public.jasenyys.jasenyys_id = {membershipId}"
        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                str(e),
                str(e)
                )
        
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
            msg().successMessage('Jäsenyys poistettu')
            self.populateRemoveMembershipDialog()
         
            
    def closeDialog(self):
        self.close()
