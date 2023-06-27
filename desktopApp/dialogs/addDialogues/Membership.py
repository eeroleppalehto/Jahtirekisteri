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

        # TODO: set current day as default
        super().__init__()

        loadUi("ui/addMembershipDialog.ui", self)

        self.setWindowTitle('Lisää jäsen ryhmään')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.membershipMemberCB = self.membershipMemberComboBox
        self.membershipGroupCB = self.membershipGroupComboBox
        self.membershipShareSB = self.membershipShareSpinBox
        self.membershipJoinDE = self.membershipJoinDateEdit

        self.membershipAddPushBtn = self.membershipAddPushButton
        self.membershipAddPushBtn.clicked.connect(self.addMembership) # Signal
        self.membershipCancelPushBtn = self.membershipCancelPushButton
        self.membershipCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddMembershipDialog()
    
    def populateAddMembershipDialog(self):
        self.membershipJoinDE.setDate(self.currentDate)

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




    def addMembership(self):
        try:
            share = self.membershipShareSB.value()
            memberChosenItemIx = self.membershipMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]
            groupChosenItemIx = self.membershipGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]
            joinDate = self.membershipJoinDE.date().toPyDate()

            sqlClauseBeginning = "INSERT INTO public.jasenyys(ryhma_id, jasen_id, liittyi, osuus) VALUES("
            sqlClauseValues = f"{groupId}, {memberId}, '{joinDate}', {share}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd


        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        # create DatabaseOperation object to execute the SQL clause
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

    def closeDialog(self):
        self.close()