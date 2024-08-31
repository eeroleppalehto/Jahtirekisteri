
# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLabel, QPushButton, QTableWidgetItem,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import dialogs.messageModule as msg
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Membership(DialogFrame):
    """
        Dialog window for editing memberships
    """

    def __init__(self):

        super().__init__()

        loadUi("ui/editMembershipDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa jäsenyys tietoja')
        
        # Elements
        
        self.editMembershipTW: QTableWidget = self.editMembershipTableWidget
        
        self.editMembershipGroupCB: QComboBox = self.editMembershipGroupComboBox
        self.editMembershipMemberCB: QComboBox = self.editMembershipMemberComboBox
        self.editMembershipPartyCB: QComboBox = self.editMembershipPartyComboBox
        self.editMembershipPartyCB.currentIndexChanged.connect(self.handlePartyCBChange)
        
        self.editMembershipJoinedDE: QDateEdit = self.editMembershipJoinedDateEdit
        self.editMembershipJoinedDE.setDate(self.currentDate)
        
        self.editMembershipExitDE: QDateEdit = self.editMembershipExitDateEdit
        self.editMembershipExitDE.setDate(self.currentDate)
        self.editMembershipExitDE.setEnabled(False)
        
        self.editMembershipExitCheck: QCheckBox = self.editMembershipExitCheckBox
        self.editMembershipExitCheck.stateChanged.connect(self.handleCheckBoxChange)
        
        self.editMembershipShareSB: QSpinBox = self.editMembershipShareSpinBox
        
        self.editMembershipCancelPushBtn: QPushButton = self.editMembershipCancelPushButton
        self.editMembershipCancelPushBtn.clicked.connect(self.closeDialog)
        
        self.editMembershipSavePushBtn: QPushButton = self.editMembershipSavePushButton
        self.editMembershipSavePushBtn.clicked.connect(self.editMembership)
        self.editMembershipSavePushBtn.setEnabled(False)
        
        self.editMembershipPopulatePushBtn: QPushButton = self.editMembershipPopulatePushButton
        self.editMembershipPopulatePushBtn.clicked.connect(self.populateFields)
        self.editMembershipPopulatePushBtn.setEnabled(False)

        # Signal when the user clicks an item on the table widget
        self.editMembershipTW.itemClicked.connect(self.onTableItemClick)

        self.populateMembershipTW()

    def populateMembershipTW(self):
        """
            Populates the widgets in the dialog window with data from the database
        """
        
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
            
            # Hide the columns with id values
            self.editMembershipTW.setColumnHidden(1, True)
            self.editMembershipTW.setColumnHidden(2, True)
            self.editMembershipTW.setColumnHidden(3, True)
            self.editMembershipTW.setColumnHidden(8, True)
            self.editMembershipTW.setColumnHidden(10, True)

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
            
            # Save the id data of the members to the combo box items
            for i in range(len(self.memberIdList)):
                self.editMembershipMemberCB.setItemData(i, databaseOperation2.resultSet[i][0])

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
            
            # Save the id data of the groups to the combo box items
            for i in range(len(self.groupIdList)):
                self.editMembershipGroupCB.setItemData(i, databaseOperation3.resultSet[i][0])
        
        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
            )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation4, self.editMembershipPartyCB, 2, 0)
            # Save the data of seurue table row to the combo box items
            # (seurue_id, seura_id, seurueen_nim, jasen_id, seurue_tyyppi_id)
            for i in range(len(self.partyIdList)):
                self.editMembershipPartyCB.setItemData(i, databaseOperation4.resultSet[i])
    
    def populateFields(self):
        """
            Populates the widgets based on the row selected on the table widget
        """
        
        try:
            # Store the values for later use
            self.membershipToEditDict = self.tempDataDict
            
            # Change the value of the member combo box to the member id of the selected row
            self.editMembershipMemberCB.setCurrentIndex(self.editMembershipMemberCB.findData(self.membershipToEditDict['jasen_id']))
            
            # Change the value of the party combo box to the party id of the selected row
            partIdIx = self.partyIdList.index(self.membershipToEditDict['seurue_id'])
            self.editMembershipPartyCB.setCurrentIndex(partIdIx)
            
            # Check
            noGroupIdValue = -1
            if self.membershipToEditDict['ryhma_id'] != noGroupIdValue:
                self.editMembershipGroupCB.setCurrentIndex(self.editMembershipGroupCB.findData(self.membershipToEditDict['ryhma_id']))
            
            joinDate =date.fromisoformat(self.membershipToEditDict['liittyi'])
            
            self.editMembershipJoinedDE.setDate(joinDate)
            
            if self.membershipToEditDict['poistui'] != "None":
                exitDate = date.fromisoformat(self.membershipToEditDict['poistui'])
                
                self.editMembershipExitDE.setDate(exitDate)
                self.editMembershipExitCheck.setChecked(True)
            else:
                self.editMembershipExitCheck.setChecked(False)
            
            self.editMembershipShareSB.setValue(self.membershipToEditDict['osuus'])
            
            self.editMembershipPopulatePushBtn.setEnabled(False)
            self.editMembershipSavePushBtn.setEnabled(True)
            
            
        except Exception as e:
            self.alert(
                'Kenttien täyttö epäonnistui',
                'Tarkista antamasi tiedot',
                'Error while populating fields',
                str(e)
            )
        

    def onTableItemClick(self, item: QTableWidgetItem): #NOTE: Working as intented!
        """_summary_

        Args:
            item (QTableWidgetItem): the item clicked from QTableWidget
        """
        
        selectedRow = item.row() # The row of the selection
        
        # As there might be no group id, check if it is None
        groupId = self.editMembershipTW.item(selectedRow, 3).text()
        noGroupIdValue = -1
        
        if groupId == "None":
            groupId = noGroupIdValue
        else:
            groupId = int(groupId)
        
        self.tempDataDict = {
            "jasenyys_id": int(self.editMembershipTW.item(selectedRow, 1).text()),
            "jasen_id": int(self.editMembershipTW.item(selectedRow, 2).text()),
            "ryhma_id": groupId,
            "seurue_id": int(self.editMembershipTW.item(selectedRow, 8).text()),
            "osuus": int(self.editMembershipTW.item(selectedRow, 7).text()),
            "liittyi": self.editMembershipTW.item(selectedRow, 5).text(),
            "poistui": self.editMembershipTW.item(selectedRow, 6).text()
        }
        
        self.editMembershipPopulatePushBtn.setEnabled(True)

    def editMembership(self):         
        try:
            editToSave = {
                "jasen_id": self.editMembershipMemberCB.currentData(),
                "seurue_id": self.editMembershipPartyCB.currentData()[4],
                "osuus": self.editMembershipShareSB.value(),
                "liittyi": self.editMembershipJoinedDE.date().toString(Qt.ISODate),
            }
            
            if self.editMembershipGroupCB.isEnabled():
                editToSave["ryhma_id"] = self.editMembershipGroupCB.currentData()
            else:
                editToSave["ryhma_id"] = None
                
            if self.editMembershipExitCheck.isChecked():
                editToSave["poistui"] = self.editMembershipExitDE.date().toString(Qt.ISODate)
            else:
                editToSave["poistui"] = None
            
            # Create a string containing the column names and values needed for the update operation
            columnValueString = ""
            for key, value in editToSave.items():
                if value == None:
                    columnValueString += f"{key} = NULL"
                else:
                    columnValueString += f"{key} = {value!r}"
                
                if key != "poistui":
                    columnValueString += ", " 

            table = 'public.jasenyys'
            limit = f"public.jasenyys.jasenyys_id = {self.membershipToEditDict['jasenyys_id']}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Jäsenyyden muokkaus epäonnistui' )
        


        # Execute the update operation
        dataBaseOperation = pgModule.DatabaseOperation()
        dataBaseOperation.updateManyValuesInRow(self.connectionArguments, table, columnValueString, limit)
        if dataBaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                dataBaseOperation.errorMessage,
                dataBaseOperation.detailedMessage
                )
        else:
            msg.PopupMessages().successMessage('Muokkaus onnistui')
            self.populateMembershipTW()

    def handlePartyCBChange(self):
        """
            Method to handle the change of the party combo box
            and disable the group combo box if the party is member type
        """
        
        # Check if data is None to avoid errors
        if self.editMembershipPartyCB.currentData() == None:
            return
        # Check the party type and disable the group combo box if the party is group type
        elif self.editMembershipPartyCB.currentData()[4] == 2:
            self.editMembershipGroupCB.setEnabled(False)
        else:
            self.editMembershipGroupCB.setEnabled(True)

    def handleCheckBoxChange(self):
        if self.editMembershipExitCheck.isChecked() == True:
            self.editMembershipExitDE.setEnabled(True)
        else:
            self.editMembershipExitDE.setEnabled(False)

    def closeDialog(self):
            self.close()

