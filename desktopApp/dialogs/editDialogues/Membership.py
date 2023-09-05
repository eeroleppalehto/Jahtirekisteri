
# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLabel, QPushButton,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Membership(DialogFrame):
    """docstring for EditMemberDialog(DialogFrame
    def __init__(self, arg):
        super(EditMemberDialog(DialogFrame).__init__()
    arg"""

    def __init__(self):

        super().__init__()

        loadUi("ui/editMembershipDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa jäsenyys tietoja')

        # TODO: Set current date on date edit widgets as default value
        
        # Elements
        self.editMembershipTW = self.editMembershipTableWidget
        self.editMembershipGroupCB = self.editMembershipGroupComboBox
        self.editMembershipMemberCB = self.editMembershipMemberComboBox
        self.editMembershipJoinedDE = self.editMembershipJoinedDateEdit
        self.editMembershipExitDE = self.editMembershipExitDateEdit
        self.editMembershipExitCheck = self.editMembershipExitCheckBox
        self.editMembershipShareSB = self.editMembershipShareSpinBox
        self.editMembershipCancelPushBtn = self.editMembershipCancelPushButton
        self.editMembershipCancelPushBtn.clicked.connect(self.closeDialog)
        self.editMembershipSavePushBtn = self.editMembershipSavePushButton
        self.editMembershipSavePushBtn.clicked.connect(self.editMembership)
        self.editMembershipPopulatePushBtn = self.editMembershipPopulatePushButton
        self.editMembershipPopulatePushBtn.clicked.connect(self.populateFields)

        # Signal when the user clicks an item on the table widget
        self.editMembershipTW.itemClicked.connect(self.onTableItemClick)

        # State to track whether user has selected membership to edit
        self.state = -1 

        self.populateMembershipTW()

    def populateMembershipTW(self):
        self.editMembershipExitDE.setDate(self.currentDate)

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.jasenyys_nimella_ryhmalla')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.membershipTable = prepareData.prepareTable(
                databaseOperation1, self.editMembershipTW)
            self.editMembershipTW.setColumnHidden(1, True)
            self.editMembershipTW.setColumnHidden(2, True)
            self.editMembershipTW.setColumnHidden(3, True)

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
                databaseOperation2, self.editMembershipMemberCB, 1, 0)

        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation3, self.editMembershipGroupCB, 2, 0)
    
    def populateFields(self):
        errorCode = 0

        memberCBIx = self.editMembershipMemberCB.findText(self.nameValue, Qt.MatchFixedString)
        if memberCBIx >= 0:
            self.editMembershipMemberCB.setCurrentIndex(memberCBIx)
        else:
            errorCode = 1
            self.alert(
                'Vakava virhe',
                'Jäsentä ei löytynyt valikosta',
                '-',
                '-'
                )
            return
        
        groupCBIx = self.editMembershipGroupCB.findText(self.groupName, Qt.MatchFixedString)
        if groupCBIx >= 0:
            self.editMembershipGroupCB.setCurrentIndex(groupCBIx)
        else:
            errorCode = 2
            self.alert(
                'Vakava virhe',
                'Ryhmää ei löytynyt valikosta',
                '-',
                '-'
                )
            return

        # Parse join date from self.joinDate and set it to the associated DateEdit object
        joinDate = QDate(
            int(self.joinDate[:4]), 
            int(self.joinDate[5:7]),
            int(self.joinDate[8:])
        )
        
        self.state = 0 if errorCode == 0 else -1
        self.editMembershipShareSB.setValue(int(self.shareValue))
        self.editMembershipJoinedDE.setDate(joinDate)
        self.membershipIdInt = int(self.membershipId)
        self.membership = [self.groupIdList[groupCBIx], self.memberIdList[memberCBIx], joinDate, int(self.shareValue)]

        # Check if exit date exists and parse the date from self.exitDate and set it to the associated DateEdit object
        if self.exitDate=="None" :
            self.editMembershipExitCheck.setChecked(False)
        else:
            exitDate = QDate(
                int(self.exitDate[:4]), 
                int(self.exitDate[5:7]),
                int(self.exitDate[8:])
            )
            self.editMembershipExitDE.setDate(exitDate)
            self.editMembershipExitCheck.setChecked(True)
            self.membership.append(exitDate)

    def onTableItemClick(self, item): #NOTE: Working as intented!
        selectedRow = item.row() # The row of the selection
        self.nameValue = self.editMembershipTW.item(selectedRow, 0).text() # text value of the id field
        self.membershipId = self.editMembershipTW.item(selectedRow, 1).text()
        self.groupName = self.editMembershipTW.item(selectedRow, 4).text()
        self.joinDate = self.editMembershipTW.item(selectedRow, 5).text()
        self.exitDate = self.editMembershipTW.item(selectedRow, 6).text()
        self.shareValue = self.editMembershipTW.item(selectedRow, 7).text()

    def editMembership(self):
        errorCode = 0
        if self.state == -1:
            self.alert(
                'Vakava virhe',
                'Et ole valinnut muokattaavaa jäsenyyttä',
                'Valitse jäsenyys valikosta ja paina täytä painiketta',
                '-'
                )
            return
        try:
            # Get memberId from the member combo box
            memberChosenItemIx = self.editMembershipMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]

            # Get groupId from the group combo box
            groupChosenItemIx = self.editMembershipGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]

            updateList = [
                groupId,
                memberId,
                self.editMembershipJoinedDE.date().toPyDate(),
                self.editMembershipShareSB.value()
            ]

            for item in updateList:
                    if item == '':
                        errorCode = 1
            columnList = [
                'ryhma_id',
                'jasen_id',
                'liittyi',
                'osuus'
            ]

            # Check if the exit check box is selected
            if self.editMembershipExitCheck.isChecked() == True:
                updateList.append(self.editMembershipExitDE.date().toPyDate())
                columnList.append('poistui')

            table = 'public.jasenyys'
            limit = f"public.jasenyys.jasenyys_id = {self.membershipIdInt}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
        if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi jäsenyyttä',
                '-'
                )
                return

        i = 0
        for data in updateList: # Check for empty list
            if data != self.membership[i]:
                databaseOperation = pgModule.DatabaseOperation()
                databaseOperation.updateTable(self.connectionArguments, table,
                columnList[i], f"{data!r}", limit)
                if databaseOperation.errorCode != 0:
                    self.alert(
                        'Vakava virhe',
                        'Tietokantaoperaatio epäonnistui',
                        databaseOperation.errorMessage,
                        databaseOperation.detailedMessage
                        )
            i += 1

        success = SuccessfulOperationDialog()
        success.exec()
        self.state = -1
        self.populateMembershipTW()

    def closeDialog(self):
            self.close()

