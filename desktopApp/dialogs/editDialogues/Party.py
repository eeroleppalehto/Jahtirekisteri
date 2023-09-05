
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
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Party(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("ui/editPartyDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa seurue tietoja')
        
        # Elements
        self.editPartyCB = self.editPartyComboBox
        self.editPartyNameLE = self.editPartyNameLineEdit
        self.editPartyLeaderCB = self.editPartyLeaderComboBox
        self.editPartyPopulatePushBtn = self.editPartyPopulatePushButton
        self.editPartyPopulatePushBtn.clicked.connect(self.populateFields)
        self.editPartyCancelPushBtn = self.editPartyCancelPushButton
        self.editPartyCancelPushBtn.clicked.connect(self.closeDialog)
        self.editPartySavePushBtn = self.editPartySavePushButton
        self.editPartySavePushBtn.clicked.connect(self.editParty)

        # State to track whether user has selected member to edit
        self.state = -1

        self.populatePartyCB()

    def populatePartyCB(self):
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
    
    # Finish populateFields, editParty, closeDialog methods
    def populateFields(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue_jasen_nimella')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            if databaseOperation.resultSet != []:
                partyChosenItemIx = self.editPartyCB.currentIndex()
                partyId = self.partyIdList[partyChosenItemIx]


                partyList = databaseOperation.resultSet
                index = -1
                i = 0
                for party in partyList:
                    if party[0] == partyId:
                        index = i
                    i += 1

                self.party = partyList[index]
                self.uneditedData = (self.party[1], self.party[2])
                
                memberCBIx = self.editPartyLeaderCB.findText(self.party[3], Qt.MatchFixedString)
                if memberCBIx >= 0:
                    self.editPartyLeaderCB.setCurrentIndex(memberCBIx)
                else:
                    self.alert(
                        'Vakava virhe',
                        'Jäsentä ei löytynyt valikosta',
                        '-',
                        '-'
                        )
                    return

                self.state = 0
                self.editPartyNameLE.setText(self.party[1])
                

    def editParty(self):
        errorCode = 0
        if self.state == -1:
            self.alert(
                'Vakava virhe',
                'Et ole valinnut muokattaavaa seuruetta',
                'Valitse seurue valikosta ja paina täytä painiketta',
                '-'
                )
            return
        try:
            memberChosenItemIx = self.editPartyLeaderCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]

            updateList = (
                self.editPartyNameLE.text(),
                memberId
            )

            for item in updateList:
                    if item == '':
                        errorCode = 1

            columnList = [
                'seurueen_nimi',
                'jasen_id'
            ]
            table = 'public.seurue'
            limit = f"public.seurue.seurue_id = {self.party[0]}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
        if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi seureen tietoja',
                '-'
                )
                return

        i = 0
        for data in updateList:
            if data != self.uneditedData[i]:
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
        self.editPartyNameLE.clear()
        self.state = -1
        self.populatePartyCB()

    def closeDialog(self):
        self.close()