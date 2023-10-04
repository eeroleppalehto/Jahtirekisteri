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

class Membership(DialogFrame):
    """Creates a dialog to add membership to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addMembershipDialog.ui", self)

        self.setWindowTitle('Lisää jäsen ryhmään')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.membershipMemberCB: QComboBox = self.membershipMemberComboBox
        self.membershipGroupCB: QComboBox = self.membershipGroupComboBox
        self.membershipShareSB: QSpinBox = self.membershipShareSpinBox
        self.membershipJoinDE: QDateEdit = self.membershipJoinDateEdit
        self.membershipJoinDE.setDate(self.currentDate) # Set current date as default
        self.membershipPartyCB: QComboBox = self.membershipPartyComboBox
        self.membershipPartyCB.currentIndexChanged.connect(self.handlePartyCBChange)

        self.membershipAddPushBtn: QPushButton = self.membershipAddPushButton
        self.membershipAddPushBtn.clicked.connect(self.addMembership) # Signal
        self.membershipCancelPushBtn: QPushButton = self.membershipCancelPushButton
        self.membershipCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddMembershipDialog()
    
    def populateAddMembershipDialog(self):
        """Method for populating the dialog windows combo boxes with data from the database
        """

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.nimivalinta') # TODO: Make own view to filter members who already have membership
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.memberIdList = prepareData.prepareComboBox(
                databaseOperation1, self.membershipMemberCB, 1, 0)
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation2, self.membershipGroupCB, 2, 0)
            
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
            )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation3, self.membershipPartyCB, 2, 0)
            
            # Save the party type data to the combo box items
            for i in range(len(self.partyIdList)):
                self.membershipPartyCB.setItemData(i, databaseOperation3.resultSet[i][4])
        
            # Call the method to handle the change of the combo box
            self.handlePartyCBChange()


    def addMembership(self):
        """Method for adding membership to the database when the push button is clicked on interface
        """
        
        # Read the data from the widgets and generate SQL clause based on them
        try:
            share = self.membershipShareSB.value()
            memberChosenItemIx = self.membershipMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]
            partyChosenItemIx = self.membershipPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            groupChosenItemIx = self.membershipGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]
            joinDate = self.membershipJoinDE.date().toPyDate()

            # Check if the party is group type or not and create SQL clause accordingly
            if self.membershipGroupCB.isEnabled():
                sqlClauseBeginning = "INSERT INTO public.jasenyys(ryhma_id, jasen_id, liittyi, osuus, seurue_id) VALUES("
                sqlClauseValues = f"{groupId}, {memberId}, '{joinDate}', {share}, {partyId}"
            else:
                sqlClauseBeginning = "INSERT INTO public.jasenyys(jasen_id, liittyi, osuus, seurue_id) VALUES("
                sqlClauseValues = f"{memberId}, '{joinDate}', {share}, {partyId}"
            
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd

        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        # Create DatabaseOperation object to execute the SQL clause
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
            success = SuccessfulOperationDialog()
            success.exec()

    def handlePartyCBChange(self):
        """
        Method for handling the change of the party combo box and 
        setting the group combo box enabled or disabled based on the party type
        """
        if self.membershipPartyCB.currentData() == 2:
            self.membershipGroupCB.setEnabled(False)
        else:
            self.membershipGroupCB.setEnabled(True)

    def closeDialog(self):
        self.close()