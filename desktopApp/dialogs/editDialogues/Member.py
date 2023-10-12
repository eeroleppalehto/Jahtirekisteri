# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QComboBox, QDateEdit,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from dialogs.messageModule import PopupMessages as msg

class Member(DialogFrame):
    """docstring for EditMemberDialog(DialogFrame
    def __init__(self, arg):
        super(EditMemberDialog(DialogFrame).__init__()
    arg"""

    def __init__(self):

        super().__init__()

        loadUi("ui/editMemberDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa jäsen tietoja')

        # Elements
        self.editMemberCB: QComboBox = self.editMemberComboBox
        self.editMemberFirstNameLE: QLineEdit = self.editMemberFirstNameLineEdit
        self.editMemberLastNameLE: QLineEdit = self.editMemberLastNameLineEdit
        self.editMemberPostalAddressLE: QLineEdit = self.editMemberPostalAddressLineEdit
        self.editMemberZipLE: QLineEdit = self.editMemberZipLineEdit
        self.editMemberCityLE: QLineEdit = self.editMemberCityLineEdit
        self.editMemberPhoneNumberLE: QLineEdit = self.editMemberPhoneNumberLineEdit
        self.editMemberCancelPushBtn: QPushButton = self.editMemberCancelPushButton
        self.editMemberCancelPushBtn.clicked.connect(self.closeDialog)
        self.editMemberSavePushBtn: QPushButton = self.editMemberSavePushButton
        self.editMemberSavePushBtn.clicked.connect(self.editMember)
        self.editMemberPopulatePushBtn: QPushButton = self.editMemberPopulatePushButton
        self.editMemberPopulatePushBtn.clicked.connect(self.populateFields)

        self.populateMemberCB()

    def populateMemberCB(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.nimivalinta')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.memberIdList = prepareData.prepareComboBox(
                databaseOperation, self.editMemberCB, 1, 0)
            
            for i in range(databaseOperation.rows):
                self.editMemberCB.setItemData(i, databaseOperation.resultSet[i][0])
        
        self.editMemberSavePushBtn.setEnabled(False)
            
    
    def populateFields(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jasen')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            if databaseOperation.resultSet != []:
                
                memberId = self.editMemberCB.currentData()
                
                # Loop through the list of members and find the one that matches the member id
                memberList = databaseOperation.resultSet
                index = -1
                i = 0
                for member in memberList:
                    if member[0] == memberId:
                        index = i
                    i += 1
            
                # TODO: Use dictionary instead of list
                self.member = memberList[index]
                
                
                self.memberToEditDict = {
                    "jasen_id": self.member[0],
                    "etunimi": self.member[1],
                    "sukunimi": self.member[2],
                    "jakeluosoite": self.member[3] if self.member[3] != None else "",
                    "postinumero": self.member[4] if self.member[4] != None else "",
                    "postitoimipaikka": self.member[5] if self.member[5] != None else "",
                    "puhelinnumero": self.member[7] if self.member[7] != None else ""
                }
                self.editMemberFirstNameLE.setText(self.memberToEditDict['etunimi'])
                self.editMemberLastNameLE.setText(self.memberToEditDict['sukunimi'])
                self.editMemberPostalAddressLE.setText(self.memberToEditDict['jakeluosoite'])
                self.editMemberZipLE.setText(self.memberToEditDict['postinumero'])
                self.editMemberCityLE.setText(self.memberToEditDict['postitoimipaikka'])
                self.editMemberPhoneNumberLE.setText(self.memberToEditDict['puhelinnumero'])
                
                self.editMemberSavePushBtn.setEnabled(True)

    def editMember(self):
        try:
            memberEditToSaveDict = {
                "jasen_id": self.memberToEditDict['jasen_id'],
                "etunimi": self.editMemberFirstNameLE.text().strip(),
                "sukunimi": self.editMemberLastNameLE.text().strip(),
                "jakeluosoite": self.editMemberPostalAddressLE.text().strip(),
                "postinumero": self.editMemberZipLE.text().strip(),
                "postitoimipaikka": self.editMemberCityLE.text().strip(),
                "puhelinnumero": self.editMemberPhoneNumberLE.text().strip()
            }
            
            # Check if any of the required fields are empty and do a early return if they are 
            if memberEditToSaveDict['etunimi'] == '' or memberEditToSaveDict['sukunimi'] == '':
                self.alert(
                    'Vakava virhe',
                    'Et voi päivittää tyhjää kenttää',
                    'Täytä etunimi ja sukunimi päivittääksesi jäsenen tietoja',
                    '-'
                    )
                return
            
            # List of fields that are optional and can be empty
            optionalFields = [
                "jakeluosoite",
                "postinumero",
                "postitoimipaikka",
                'puhelinnumero'
            ]
            
            # Generate the update column and value string and the limit string
            columnValueString = ""
            
            for key in memberEditToSaveDict:
                # Skip the jasen_id
                if key == "jasen_id":
                    continue
                
                # Check if the field is optional and if it is, check if it is empty
                # and if it is empty, set the value to NULL
                if key in optionalFields:
                    if memberEditToSaveDict[key] == "":
                        columnValueString += f"{key} = NULL"
                    else:
                        columnValueString += f"{key} = {memberEditToSaveDict[key]!r}"
                else:
                    columnValueString += f"{key} = {memberEditToSaveDict[key]!r}"
                
                # Add comma if the key is not the last one
                if key != "puhelinnumero":
                    columnValueString += ", "
            
            table = 'public.jasen'
            limit = f"public.jasen.jasen_id = {self.member[0]}"

        except Exception as e:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen', str(e))
            return
    
        
        if self.isEquals(memberEditToSaveDict, self.memberToEditDict) == True:
            msg().warningMessage('Muutoksia ei ole tehty')
            return
        
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


        # Clear fields and disable save button
        msg().successMessage('Muokkaus onnistui')
        self.editMemberFirstNameLE.clear(),
        self.editMemberLastNameLE.clear(),
        self.editMemberPostalAddressLE.clear(),
        self.editMemberZipLE.clear(),
        self.editMemberCityLE.clear()
        self.editMemberPhoneNumberLE.clear()
        self.editMemberSavePushBtn.setEnabled(False)
        self.populateMemberCB()

    def isEquals(self, editToSaveDict, selectedDict):
        """Compare the data in the edit fields to the original data
        And return False if there are any changes
        Otherwise return True

        Args:
            editToSaveDict (dict): dict of the data in the edit fields
            selectedDict (dict): dict of the original data

        Returns:
            boolean: return true if there are no changes in the data
        """
        
        for key in editToSaveDict:
            if editToSaveDict[key] != selectedDict[key]:
                return False
        return True

    def closeDialog(self):
            self.close()
