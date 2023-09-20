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
        self.editMemberCB = self.editMemberComboBox
        self.editMemberFirstNameLE = self.editMemberFirstNameLineEdit
        self.editMemberLastNameLE = self.editMemberLastNameLineEdit
        self.editMemberPostalAddressLE = self.editMemberPostalAddressLineEdit
        self.editMemberZipLE = self.editMemberZipLineEdit
        self.editMemberCityLE = self.editMemberCityLineEdit
        self.editMemberCancelPushBtn = self.editMemberCancelPushButton
        self.editMemberCancelPushBtn.clicked.connect(self.closeDialog)
        self.editMemberSavePushBtn = self.editMemberSavePushButton
        self.editMemberSavePushBtn.clicked.connect(self.editMember)
        self.editMemberPopulatePushBtn = self.editMemberPopulatePushButton
        self.editMemberPopulatePushBtn.clicked.connect(self.populateFields)

        # State to track whether user has selected member to edit
        self.state = -1 

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
            self.companyInfo = []
            if databaseOperation.resultSet != []:

                memberChosenItemIx = self.editMemberCB.currentIndex()
                memberId = self.memberIdList[memberChosenItemIx]

                memberList = databaseOperation.resultSet
                index = -1
                i = 0

                for member in memberList:
                    if member[0] == memberId:
                        index = i
                    i += 1
            
                self.state = 0
                self.member = memberList[index]
                self.editMemberFirstNameLE.setText(self.member[1])
                self.editMemberLastNameLE.setText(self.member[2])
                self.editMemberPostalAddressLE.setText(self.member[3])
                self.editMemberZipLE.setText(self.member[4])
                self.editMemberCityLE.setText(self.member[5])

    def editMember(self):
        errorCode = 0
        if self.state == -1:
            self.alert(
                'Vakava virhe',
                'Et ole valinnut muokattaavaa jäsentä',
                'Valitse jäsen valikosta ja paina täytä painiketta',
                '-'
                )
            return
        try:
            updateList = (
                self.editMemberFirstNameLE.text(),
                self.editMemberLastNameLE.text(),
                self.editMemberPostalAddressLE.text(),
                self.editMemberZipLE.text(),
                self.editMemberCityLE.text()
            )

            for item in updateList:
                    if item == '':
                        errorCode = 1
                
            columnList = [
                'etunimi',
                'sukunimi',
                'jakeluosoite',
                'postinumero',
                'postitoimipaikka'
            ]
            table = 'public.jasen'
            limit = f"public.jasen.jasen_id = {self.member[0]}"

        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        

        if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi jäsenen tietoja',
                '-'
                )
                return
        
        i = 0
        j = 1
        for data in updateList:
            if data != self.member[j]:
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
            j += 1

        success = SuccessfulOperationDialog()
        success.exec()
        self.editMemberFirstNameLE.clear(),
        self.editMemberLastNameLE.clear(),
        self.editMemberPostalAddressLE.clear(),
        self.editMemberZipLE.clear(),
        self.editMemberCityLE.clear()
        self.state = -1
        self.populateMemberCB()

    def closeDialog(self):
            self.close()
