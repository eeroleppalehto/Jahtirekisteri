
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

class Company(DialogFrame):
    """Creates a dialog to edit company in database"""
    # TODO: Check for possible errors
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("editCompanyDialog.ui", self)

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

        loadUi("editMemberDialog.ui", self)

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

        loadUi("editMembershipDialog.ui", self)

        self.setWindowTitle('Muokkaa jäsenyys tietoja')

        # TODO: Set current date on date edit widgets as default value
        
        # Elements
        self.editMembershipTW = self.editMembershipTableWidget
        self.editMembershipGroupCB = self.editMembershipGroupComboBox
        self.editMembershipMemberCB = self.editMembershipMemberComboBox
        self.editMembershipJoinedDE = self.editMembershipJoinedDateEdit
        self.editMembershipExitDE = self.editMembershipExitDateEdit
        self.editMembershipShareSB = self.editMembershipShareSpinBox
        self.editMembershipCancelPushBtn = self.editMembershipCancelPushButton
        self.editMembershipCancelPushBtn.clicked.connect(self.closeDialog)
        self.editMembershipSavePushBtn = self.editMembershipSavePushButton
        self.editMembershipSavePushBtn.clicked.connect(self.editMember)
        self.editMembershipPopulatePushBtn = self.editMembershipPopulatePushButton
        self.editMembershipPopulatePushBtn.clicked.connect(self.populateFields)

        # Signal when the user clicks an item on the table widget
        self.editMembershipTW.itemClicked.connect(self.onTableItemClick)

        # self.editMembershipTW.itemClicked.connect(self.onTableItemClick)

        self.populateMembershipTW()

    def populateMembershipTW(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_nimella_ryhmalla')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.membershipTable = prepareData.prepareTable(
                databaseOperation, self.editMembershipTW)

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
            self.memberIdList = prepareData.prepareComboBox(
                databaseOperation3, self.editMembershipGroupCB, 2, 0)
    
    def populateFields(self):
        # currentRow = self.editMembershipTW.currentRow()
        
        #TODO: Check if item is selected from tableWidget
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

        # TODO: Add join date
        self.editMembershipShareSB.setValue(int(self.shareValue))


        # self.editMembershipMemberCB.setCurrentText(self.editMembershipTW.itemAt(0, self.editMembershipTW.currentRow()).text())
        

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

    def onTableItemClick(self, item): #NOTE: Working as intented!
        selectedRow = item.row() # The row of the selection
        selectedColumn = item.column() # The column of the selection
        self.nameValue = self.editMembershipTW.item(selectedRow, 0).text() # text value of the id field
        self.groupName = self.editMembershipTW.item(selectedRow, 4).text()
        self.shareValue = self.editMembershipTW.item(selectedRow, 7).text()
        print(self.nameValue + ", " + self.groupName)

class Group(DialogFrame):
    def __init__(self):

        super().__init__()

        loadUi("editGroupDialog.ui", self)

        self.setWindowTitle('Muokkaa ryhmän tietoja')

        # Elements
        self.editGroupCB = self.editGroupComboBox
        self.editGroupPartyCB = self.editGroupPartyComboBox
        self.editGroupNameLE = self.editGroupNameLineEdit
        self.editGroupCancelPushBtn = self.editGroupCancelPushButton
        self.editGroupSavePushBtn = self.editGroupSavePushButton

    def populateGroupCB(self):
        pass