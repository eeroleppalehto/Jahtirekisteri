
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

class Group(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("ui/editGroupDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa ryhmän tietoja')

        # Elements
        self.editGroupCB: QComboBox = self.editGroupComboBox
        self.editGroupPartyCB: QComboBox = self.editGroupPartyComboBox
        self.editGroupNameLE: QLineEdit = self.editGroupNameLineEdit
        self.editGroupCancelPushBtn: QPushButton = self.editGroupCancelPushButton
        self.editGroupCancelPushBtn.clicked.connect(self.closeDialog)
        self.editGroupSavePushBtn: QPushButton = self.editGroupSavePushButton
        self.editGroupSavePushBtn.clicked.connect(self.editGroup)
        self.editGroupPopulatePushBtn: QPushButton = self.editGroupPopulatePushButton
        self.editGroupPopulatePushBtn.clicked.connect(self.populateFields)

        # State to track whether user has selected group to edit
        self.state = -1 

        self.populateGroupCB()

    def populateGroupCB(self):
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_seurueen_nimella')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation1, self.editGroupCB, 1, 0)
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation2, self.editGroupPartyCB, 2, 0)
    
    def populateFields(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_seurueen_nimella')
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
                
                groupChosenItemIx = self.editGroupCB.currentIndex()
                groupId = self.groupIdList[groupChosenItemIx]
        
                groupList = databaseOperation.resultSet

                index = -1
                i = 0

                for group in groupList:
                    if group[0] == groupId:
                        index = i
                    i += 1
            
                self.group = groupList[index]
        
                # (ryhma_id, ryhma_nimi, seurue_id, seurue_nimi)
                self.uneditedData = ( self.group[2], self.group[1] )
                partyCBIx = self.editGroupPartyCB.findText(self.group[3], Qt.MatchFixedString)
                if partyCBIx >= 0:
                    self.editGroupPartyCB.setCurrentIndex(partyCBIx)
                else:
                    self.alert(
                        'Vakava virhe',
                        'Seuruetta ei löytynyt valikosta',
                        '-',
                        '-'
                        )
                    return

                self.state = 0
                self.editGroupNameLE.setText(self.group[1])
    
    def editGroup(self):
        errorCode = 0
        if self.state == -1:
            self.alert(
                'Vakava virhe',
                'Et ole valinnut muokattaavaa ryhmää',
                'Valitse ryhmä valikosta ja paina täytä painiketta',
                '-'
                )
            return
        try:
            partyChosenItemIx = self.editGroupPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]

            updateList = (
                partyId,
                self.editGroupNameLE.text()
            )
            for item in updateList:
                    if item == '':
                        errorCode = 1

            columnList = [
                'seurue_id',
                'ryhman_nimi'
            ]
            table = 'public.jakoryhma'
            limit = f"public.jakoryhma.ryhma_id = {self.group[0]}"   
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Ryhmän muokkaus epäonnistui' )
        
        if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi ryhmän tietoja',
                '-'
                )
                return

        i = 0
        j = 1
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
            j += 1

        msg.PopupMessages().successMessage('Muokkaus onnistui')
        self.editGroupNameLE.clear()
        self.state = -1
        self.populateGroupCB()

    def closeDialog(self):
        self.close()
