
# LIBRARIES AND MODULES
# ---------------------
import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.uic import loadUi
from dialogs.DialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule
import prepareData
from datetime import date

# FIXME: Change save updates to execute the save as one update that saves all the columns at once rather than each column seperately
class Company(DialogFrame):
    """Creates a dialog to edit company in database"""
    # TODO: Check for possible errors
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/editCompanyDialog.ui", self)

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
                self.companyInfo = databaseOperation.resultSet[0] # TODO: try catch?
                self.editCompanyNameLE.setText(self.companyInfo[1])
                self.editCompanyPostalAddressLE.setText(self.companyInfo[2])
                self.editCompanyZIPLE.setText(self.companyInfo[3])
                self.editCompanyCityLE.setText(self.companyInfo[4])
                print(self.companyInfo) # TODO: Remove in production


    def editCompany(self):
        # TODO: dbConnection...insertRow...
        if self.companyInfo != []: # try/except?
            try:
                updateList = (
                    self.editCompanyNameLE.text(),
                    self.editCompanyPostalAddressLE.text(),
                    self.editCompanyZIPLE.text(),
                    self.editCompanyCityLE.text()
                )
                print(updateList)
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
            
            i = 0
            j = 1
            for data in updateList:
                if data != self.companyInfo[j]:
                    databaseOperation = pgModule.DatabaseOperation()
                    databaseOperation.updateTable(self.connectionArguments, table,
                    columnList[i], f"'{data}'", limit)
                    if databaseOperation.errorCode != 0:
                        self.alert(
                            'Vakava virhe',
                            'Tietokantaoperaatio epäonnistui',
                            databaseOperation.errorMessage,
                            databaseOperation.detailedMessage
                            )
                    else:
                        print("Updated")
                    # FIXME: Finish
                i += 1
                j += 1
        else:
            try:
                companyName = self.editCompanyNameLE.text()
                postAddress = self.editCompanyPostalAddressLE.text()
                zipCode = self.editCompanyZIPLE.text()
                city = self.editCompanyCityLE.text()

                sqlClauseBeginning = "INSERT INTO public.seura(seuran_nimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
                sqlClauseValues = f"'{companyName}', '{postAddress}', '{zipCode}', '{city}'"
                sqlClauseEnd = ");"
                sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            except:
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

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

class Member(DialogFrame):
    """docstring for EditMemberDialog(DialogFrame
    def __init__(self, arg):
        super(EditMemberDialog(DialogFrame).__init__()
    arg"""

    def __init__(self):

        super().__init__()

        loadUi("ui/editMemberDialog.ui", self)

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
            self.companyInfo = [] # TODO: Check if needed
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
            
                self.member = memberList[index]
                self.editMemberFirstNameLE.setText(self.member[1])
                self.editMemberLastNameLE.setText(self.member[2])
                self.editMemberPostalAddressLE.setText(self.member[3])
                self.editMemberZipLE.setText(self.member[4])
                self.editMemberCityLE.setText(self.member[5])

    def editMember(self):
        try:
            updateList = (
                self.editMemberFirstNameLE.text(),
                self.editMemberLastNameLE.text(),
                self.editMemberPostalAddressLE.text(),
                self.editMemberZipLE.text(),
                self.editMemberCityLE.text()
            )
            print(updateList)
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
        
        i = 0
        j = 1
        for data in updateList:
            if data != self.member[j]:
                databaseOperation = pgModule.DatabaseOperation()
                databaseOperation.updateTable(self.connectionArguments, table,
                columnList[i], f"'{data}'", limit)
                if databaseOperation.errorCode != 0:
                    self.alert(
                        'Vakava virhe',
                        'Tietokantaoperaatio epäonnistui',
                        databaseOperation.errorMessage,
                        databaseOperation.detailedMessage
                        )
                else:
                    print("Updated")
                # FIXME: Finish
            i += 1
            j += 1

        success = SuccessfulOperationDialog()
        success.exec()
        self.editMemberFirstNameLE.clear(),
        self.editMemberLastNameLE.clear(),
        self.editMemberPostalAddressLE.clear(),
        self.editMemberZipLE.clear(),
        self.editMemberCityLE.clear()

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

        self.populateMembershipTW()

    def populateMembershipTW(self):
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
        # TODO: Check if item is selected from tableWidget
        memberCBIx = self.editMembershipMemberCB.findText(self.nameValue, Qt.MatchFixedString)
        groupCBIx = self.editMembershipGroupCB.findText(self.groupName, Qt.MatchFixedString)
        if memberCBIx >= 0:
            self.editMembershipMemberCB.setCurrentIndex(memberCBIx)
        else:
            print("No match") # TODO: Remove in production
        
        if groupCBIx >= 0:
            self.editMembershipGroupCB.setCurrentIndex(groupCBIx)
        else:
            print("No match") # TODO: Remove in production

        self.editMembershipShareSB.setValue(int(self.shareValue))
        # Parse join date from self.joinDate and set it to the associated DateEdit object
        joinDate = QDate(
            int(self.joinDate[:4]), 
            int(self.joinDate[5:7]),
            int(self.joinDate[8:])
        )

        self.editMembershipJoinedDE.setDate(joinDate)
        print(self.editMembershipJoinedDE.date().toPyDate(), "asd")
        self.membershipIdInt = int(self.membershipId)
        self.membership = [groupCBIx, memberCBIx, self.joinDate, int(self.shareValue)]

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
        self.membership.append(self.exitDate)

    def onTableItemClick(self, item): #NOTE: Working as intented!
        selectedRow = item.row() # The row of the selection
        self.nameValue = self.editMembershipTW.item(selectedRow, 0).text() # text value of the id field
        self.membershipId = self.editMembershipTW.item(selectedRow, 1).text()
        self.groupName = self.editMembershipTW.item(selectedRow, 4).text()
        self.joinDate = self.editMembershipTW.item(selectedRow, 5).text()
        self.exitDate = self.editMembershipTW.item(selectedRow, 6).text()
        # print(self.exitDate, "type:", type(self.exitDate))
        print(self.joinDate, "asd")
        # print(int(self.joinDate[:4]), int(self.joinDate[5:7]), int(self.joinDate[8:]))
        self.shareValue = self.editMembershipTW.item(selectedRow, 7).text()
        # print(self.nameValue + ", " + self.groupName) TODO: remove comments  

    def editMembership(self):
        # TODO: Chech Error handeling
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
            print(updateList)
            columnList = [
                'ryhma_id',
                'jasen_id',
                'liittyi',
                'osuus'
            ]

            # Check if the exit check box is selected
            if self.editMembershipExitCheck.isChecked() == True:
                # TODO: Figure out how to skip the update if
                updateList.append(self.editMembershipExitDE.date().toPyDate())
                columnList.append('poistui')

            table = 'public.jasenyys'
            limit = f"public.jasenyys.jasenyys_id = {self.membershipIdInt}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
        i = 0
        for data in updateList: # Check for empty list
            if data != self.membership[i]:
                databaseOperation = pgModule.DatabaseOperation()
                databaseOperation.updateTable(self.connectionArguments, table,
                columnList[i], f"'{data}'", limit)
                if databaseOperation.errorCode != 0:
                    self.alert(
                        'Vakava virhe',
                        'Tietokantaoperaatio epäonnistui',
                        databaseOperation.errorMessage,
                        databaseOperation.detailedMessage
                        )
                else:
                    print("Updated", columnList[i])
                # FIXME: Finish
            i += 1

        success = SuccessfulOperationDialog()
        success.exec()
        updateList = []

    def closeDialog(self):
            self.close()

class Group(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("ui/editGroupDialog.ui", self)

        self.setWindowTitle('Muokkaa ryhmän tietoja')

        # Elements
        self.editGroupCB = self.editGroupComboBox
        self.editGroupCB.currentTextChanged.connect(self.text_changed)
        self.editGroupTW = self.editGroupTableWidget
        self.editGroupPartyCB = self.editGroupPartyComboBox
        self.editGroupNameLE = self.editGroupNameLineEdit
        self.editGroupCancelPushBtn = self.editGroupCancelPushButton
        self.editGroupCancelPushBtn.clicked.connect(self.closeDialog)
        self.editGroupSavePushBtn = self.editGroupSavePushButton
        self.editGroupSavePushBtn.clicked.connect(self.editGroup)
        self.editGroupPopulatePushBtn = self.editGroupPopulatePushButton
        self.editGroupPopulatePushBtn.clicked.connect(self.populateFields)

        self.populateGroupCB()

    
    def text_changed(self, s):
        print("Text changed:", s) # TODO: remove from production

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
            self.companyInfo = [] # TODO: Check if needed
            if databaseOperation.resultSet != []:
                # TODO: Remove comments
                groupChosenItemIx = self.editGroupCB.currentIndex()
                # print(groupChosenItemIx)
                groupId = self.groupIdList[groupChosenItemIx]
                # print(groupId)

                groupList = databaseOperation.resultSet
                # print("GroupList:", groupList)
                index = -1
                i = 0

                for group in groupList:
                    if group[0] == groupId:
                        index = i
                    i += 1
            
                self.group = groupList[index]
                # print("Group:", self.group)
                # (ryhma_id, ryhma_nimi, seurue_id, seurue_nimi)
                self.uneditedData = ( self.group[2], self.group[1] )
                partyCBIx = self.editGroupPartyCB.findText(self.group[3], Qt.MatchFixedString)
                if partyCBIx >= 0:
                    self.editGroupPartyCB.setCurrentIndex(partyCBIx)
                else:
                    print("No match")
                self.editGroupNameLE.setText(self.group[1])
    
    def editGroup(self):
        try:
            partyChosenItemIx = self.editGroupPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]

            updateList = (
                partyId,
                self.editGroupNameLE.text()
            )
            # print(updateList)
            columnList = [
                'seurue_id',
                'ryhman_nimi'
            ]
            table = 'public.jakoryhma'
            limit = f"public.jakoryhma.ryhma_id = {self.group[0]}"   
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
        i = 0
        j = 1
        for data in updateList:
            if data != self.uneditedData[i]:
                databaseOperation = pgModule.DatabaseOperation()
                databaseOperation.updateTable(self.connectionArguments, table,
                columnList[i], f"'{data}'", limit)
                if databaseOperation.errorCode != 0:
                    self.alert(
                        'Vakava virhe',
                        'Tietokantaoperaatio epäonnistui',
                        databaseOperation.errorMessage,
                        databaseOperation.detailedMessage
                        )
                else:
                    print("Updated")
                # FIXME: Finish
            i += 1
            j += 1

        # TODO: Clear line edits and clear the uneditedData tuple, check for empty Line edits
        success = SuccessfulOperationDialog()
        success.exec()

    def closeDialog(self):
        self.close()

class Party(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("ui/editPartyDialog.ui", self)

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

                self.editPartyNameLE.setText(self.party[1])

                memberCBIx = self.editPartyLeaderCB.findText(self.party[3], Qt.MatchFixedString)
                if memberCBIx >= 0:
                    self.editPartyLeaderCB.setCurrentIndex(memberCBIx)
                else:
                    print("No match")

    def editParty(self):
        try:
            memberChosenItemIx = self.editPartyLeaderCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]

            updateList = (
                self.editPartyNameLE.text(),
                memberId
            )

            columnList = [
                'seurueen_nimi',
                'jasen_id'
            ]
            table = 'public.seurue'
            limit = f"public.seurue.seurue_id = {self.party[0]}"
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
        i = 0
        for data in updateList:
            if data != self.uneditedData[i]:
                databaseOperation = pgModule.DatabaseOperation()
                databaseOperation.updateTable(self.connectionArguments, table,
                columnList[i], f"'{data}'", limit)
                if databaseOperation.errorCode != 0:
                    self.alert(
                        'Vakava virhe',
                        'Tietokantaoperaatio epäonnistui',
                        databaseOperation.errorMessage,
                        databaseOperation.detailedMessage
                        )
                else:
                    print("Updated", columnList[i], "with", data)
            i += 1
        
        success = SuccessfulOperationDialog()
        success.exec()

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