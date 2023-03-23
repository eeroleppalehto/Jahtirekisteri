
# LIBRARIES AND MODULES
# ---------------------
import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class Company(DialogFrame):
    """Creates a dialog to edit company in database"""
    # TODO: Check for possible errors
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/editCompanyDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa seuraa')

        # Elements
        self.editCompanyNameLE = self.editCompanyNameLineEdit
        self.editCompanyPostalAddressLE = self.editCompanyPostalAddressLineEdit
        self.editCompanyZIPLE = self.editCompanyZIPLineEdit
        self.editCompanyCityLE = self.editCompanyCityLineEdit

        self.editCompanySavePushBtn = self.editCompanySavePushButton
        self.editCompanySavePushBtn.clicked.connect(self.editCompany) # Signal
        self.editCompanyCancelPushBtn = self.editCompanyCancelPushButton
        self.editCompanyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateEditCompanyDialog()
        
        

    
    def populateEditCompanyDialog(self):

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.seura')
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
                self.companyInfo = databaseOperation.resultSet[0]
                self.editCompanyNameLE.setText(self.companyInfo[1])
                self.editCompanyPostalAddressLE.setText(self.companyInfo[2])
                self.editCompanyZIPLE.setText(self.companyInfo[3])
                self.editCompanyCityLE.setText(self.companyInfo[4])


    def editCompany(self):
        success = SuccessfulOperationDialog()
        errorCode = 0
        # Update option
        if self.companyInfo != []:
            try:
                updateList = (
                    self.editCompanyNameLE.text(),
                    self.editCompanyPostalAddressLE.text(),
                    self.editCompanyZIPLE.text(),
                    self.editCompanyCityLE.text()
                )

                for item in updateList:
                    if item == '':
                        errorCode = 1

                columnList = [
                    'seuran_nimi',
                    'jakeluosoite',
                    'postinumero',
                    'postitoimipaikka'
                ]
                table = 'public.seura'
                limit = 'public.seura.seura_id = 1'

            except:
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            
            if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi seuran tiedot',
                '-'
                )
                return
            
            i = 0
            j = 1
            for data in updateList:
                if data != self.companyInfo[j]:
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

            success.exec()
            
        # Add option
        else:
            try:
                companyName = self.editCompanyNameLE.text()
                postAddress = self.editCompanyPostalAddressLE.text()
                zipCode = self.editCompanyZIPLE.text()
                city = self.editCompanyCityLE.text()

                companyList = (companyName, postAddress, zipCode, city)
                for item in companyList:
                    if item == '':
                        errorCode = 1
                        break
                

                sqlClauseBeginning = "INSERT INTO public.seura(seuran_nimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
                sqlClauseValues = f"'{companyName}', '{postAddress}', '{zipCode}', '{city}'"
                sqlClauseEnd = ");"
                sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            except:
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

            if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä kaikki kentät lisätäksesi seuran',
                '-'
                )
                return
            
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
                success.exec()


    def closeDialog(self):
        self.close()

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
        memberCBIx = self.editMembershipMemberCB.findText(self.nameValue, Qt.MatchFixedString)
        if memberCBIx >= 0:
            self.editMembershipMemberCB.setCurrentIndex(memberCBIx)
        else:
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

        self.state = 0
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

class Group(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("ui/editGroupDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa ryhmän tietoja')

        # Elements
        self.editGroupCB = self.editGroupComboBox
        self.editGroupPartyCB = self.editGroupPartyComboBox
        self.editGroupNameLE = self.editGroupNameLineEdit
        self.editGroupCancelPushBtn = self.editGroupCancelPushButton
        self.editGroupCancelPushBtn.clicked.connect(self.closeDialog)
        self.editGroupSavePushBtn = self.editGroupSavePushButton
        self.editGroupSavePushBtn.clicked.connect(self.editGroup)
        self.editGroupPopulatePushBtn = self.editGroupPopulatePushButton
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
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
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

        success = SuccessfulOperationDialog()
        success.exec()
        self.editGroupNameLE.clear()
        self.state = -1
        self.populateGroupCB()

    def closeDialog(self):
        self.close()

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

        

class TestMainWindow(QMainWindow):
    """Main Window for testing dialogs."""

    def __init__(self):
        super().__init__()

        self.setWindowTitle('Pääikkuna dialogien testaukseen')

        # Add dialogs to be tested here and run them as follows:
        saveDBSettingsDialog = Group()
        saveDBSettingsDialog.exec()

# Some tests
if __name__ == "__main__":

    # Create a testing application
    testApp = QApplication(sys.argv)

    # Create a main window for testing a dialog
    testMainWindow = TestMainWindow()
    testMainWindow.show()

    # Run the testing application
    testApp.exec()
