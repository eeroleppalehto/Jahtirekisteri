
# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import dialogs.messageModule as msg
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Party(DialogFrame):
    """
        Dialog for editing party information
    """
    
    def __init__(self):

        super().__init__()

        loadUi("ui/editPartyDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa seurue tietoja')
        
        # Elements
        self.editPartyCB: QComboBox = self.editPartyComboBox
        self.editPartyCB.currentIndexChanged.connect(self.hadlePartyCBChange)
        self.editPartyNameLE: QLineEdit = self.editPartyNameLineEdit
        self.editPartyLeaderCB: QComboBox = self.editPartyLeaderComboBox
        self.editPartyTypeCB: QComboBox = self.editPartyTypeComboBox
        
        self.editPartyPopulatePushBtn: QPushButton = self.editPartyPopulatePushButton
        self.editPartyPopulatePushBtn.clicked.connect(self.populateFields)
        
        self.editPartyCancelPushBtn: QPushButton = self.editPartyCancelPushButton
        self.editPartyCancelPushBtn.clicked.connect(self.closeDialog)
        
        self.editPartySavePushBtn: QPushButton = self.editPartySavePushButton
        self.editPartySavePushBtn.setEnabled(False)
        self.editPartySavePushBtn.clicked.connect(self.editParty)

        self.populatePartyCB()

    def populatePartyCB(self):
        """
            Method for populating the widgets of the dialog
        """
        
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation1, self.editPartyCB, 2, 0)
            
            # Save the data of the parties to the combo box items
            # as QCobmoBox has a method of storing data to the items
            for i in range(len(self.partyIdList)):
                self.editPartyCB.setItemData(i, databaseOperation1.resultSet[i])
            
            # Call the method to handle the change of the combo box
            self.hadlePartyCBChange()

        # Populate party leader combo box
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
                databaseOperation2, self.editPartyLeaderCB, 1, 0)
            
            # Save the data of the members to the combo box items
            for i in range(len(self.memberIdList)):
                self.editPartyLeaderCB.setItemData(i, self.memberIdList[i])
            
        # Populate party type combo box
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue_tyyppi')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            self.partyTypeList = prepareData.prepareComboBox(
                databaseOperation3, self.editPartyTypeCB, 1, 0)
            
            # Save the data of the party types to the combo box items
            for i in range(len(self.partyTypeList)):
                self.editPartyTypeCB.setItemData(i, self.partyTypeList[i])
        
    
    def populateFields(self):
        """
            Method for populating the fields of the dialog
            based on the chosen party
        """
        
        try:
            # Save data for later use
            self.chosenParty = self.tempDataDict
            
            # Set the data from the chosen party to the fields
            self.editPartyNameLE.setText(self.chosenParty['seurueen_nimi'])
            
            # Find the index of the chosen party leader from the combo box
            # and set the combo box to that index
            memberCBIx = self.editPartyLeaderCB.findData(self.chosenParty['jasen_id'])
            self.editPartyLeaderCB.setCurrentIndex(memberCBIx)
            
            # Find the index of the chosen party type from the combo box
            # and set the combo box to that index
            typeCBIx = self.editPartyTypeCB.findData(self.chosenParty['seurue_tyyppi_id'])
            self.editPartyTypeCB.setCurrentIndex(typeCBIx)
            
            # Enable the save button
            self.editPartySavePushBtn.setEnabled(True)
        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Kenttien täydennys epäonnistui',
                str(e),
                '-'
                )
        
        
    def hadlePartyCBChange(self):
        """
            Method for handling the change of the party combo box
            and saving the data of the current party to a temporary dictionary
        """
        
        # Initial render of the dialog, the combo box is empty and to avoid errors
        # we need to check if the combo box has any data
        if self.editPartyCB.currentData() == None:
            return
        
        self.tempDataDict = {
            "seurue_id": self.editPartyCB.currentData()[0],
            "seura_id": self.editPartyCB.currentData()[1],
            "seurueen_nimi": self.editPartyCB.currentData()[2],
            "jasen_id": self.editPartyCB.currentData()[3],
            "seurue_tyyppi_id": self.editPartyCB.currentData()[4]
        }
                

    def editParty(self):
        """
            Method for editing party information when the save button is clicked
        """
        
        try:
            # Create a dictionary of the values to be updated
            editToSave = {
                "seurueen_nimi": self.editPartyNameLE.text(),
                "jasen_id": self.editPartyLeaderCB.currentData(),
                "seurue_tyyppi_id": self.editPartyTypeCB.currentData()
            }
            
            # Create a string of the columns and values to be updated
            # from the dictionary above
            columnValueString = ""
            for key, value in editToSave.items():
                columnValueString += f"{key} = {value!r}"
                if key != "seurue_tyyppi_id":
                    columnValueString += ", "
                
            
            table = 'public.seurue'
            limit = f"public.seurue.seurue_id = {self.chosenParty['seurue_id']}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Muokkaus epäonnistui' )

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.updateManyValuesInRow(self.connectionArguments, table, columnValueString, limit)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
            return
        
        msg.PopupMessages().successMessage('Muokkaus onnistui')
        self.editPartyNameLE.clear()
        self.editPartySavePushBtn.setEnabled(False)
        self.populatePartyCB()

    def closeDialog(self):
        self.close()