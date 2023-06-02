import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QLabel, QPushButton, QDateEdit, QSpinBox, QComboBox, QLineEdit
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date


class Member(DialogFrame):
    """Creates a dialog to add member to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addMemberDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Lisää jäsen')

        # Elements
        self.addMemberFirstNameLE = self.addMemberFirstNameLineEdit
        self.addMemberLastNameLE = self.addMemberLastNameLineEdit
        self.addMemberPostalAddressLE = self.addMemberPostalAddressLineEdit
        self.addMemberZIPLE = self.addMemberZIPLineEdit
        self.addMemberCityLE = self.addMemberCityLineEdit
        self.addMemberAddPushBtn = self.addMemberAddPushButton
        self.addMemberAddPushBtn.clicked.connect(self.addMember) # Signal
        self.addMemberCancelPushBtn = self.addMemberCancelPushButton
        self.addMemberCancelPushBtn.clicked.connect(self.closeDialog) # Signal
    

    def addMember(self):
        try:
            firstName = self.addMemberFirstNameLE.text()
            lastName = self.addMemberLastNameLE.text()
            postAddress = self.addMemberPostalAddressLE.text()
            zipCode = self.addMemberZIPLE.text()
            city = self.addMemberCityLE.text()

            memberList = (firstName, lastName, postAddress, zipCode, city)

            errorCode = 0
            for item in memberList:
                if item == '':
                    errorCode = 1
                    break

            sqlClauseBeginning = "INSERT INTO public.jasen(etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
            sqlClauseValues = f"'{firstName}', '{lastName}', '{postAddress}', '{zipCode}', '{city}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä kaikki kentät lisätäksesi jäsenen',
                '-'
                )
        else:
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
                self.addMemberFirstNameLE.clear()
                self.addMemberLastNameLE.clear()
                self.addMemberPostalAddressLE.clear()
                self.addMemberZIPLE.clear()
                self.addMemberCityLE.clear()


    def closeDialog(self):
        self.close()

class Membership(DialogFrame):
    """Creates a dialog to add membership to database"""
    
    # Constructor
    def __init__(self):

        # TODO: set current day as default
        super().__init__()

        loadUi("ui/addMembershipDialog.ui", self)

        self.setWindowTitle('Lisää jäsen ryhmään')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.membershipMemberCB = self.membershipMemberComboBox
        self.membershipGroupCB = self.membershipGroupComboBox
        self.membershipShareSB = self.membershipShareSpinBox
        self.membershipJoinDE = self.membershipJoinDateEdit

        self.membershipAddPushBtn = self.membershipAddPushButton
        self.membershipAddPushBtn.clicked.connect(self.addMembership) # Signal
        self.membershipCancelPushBtn = self.membershipCancelPushButton
        self.membershipCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddMembershipDialog()
    
    def populateAddMembershipDialog(self):
        self.membershipJoinDE.setDate(self.currentDate)

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.nimivalinta') # TODO: Make own view to filter members who already have membership
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.memberIdList = prepareData.prepareComboBox(
                databaseOperation1, self.membershipMemberCB, 1, 0)
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation2, self.membershipGroupCB, 2, 0)




    def addMembership(self):
        try:
            share = self.membershipShareSB.value()
            memberChosenItemIx = self.membershipMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]
            groupChosenItemIx = self.membershipGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]
            joinDate = self.membershipJoinDE.date().toPyDate()

            sqlClauseBeginning = "INSERT INTO public.jasenyys(ryhma_id, jasen_id, liittyi, osuus) VALUES("
            sqlClauseValues = f"{groupId}, {memberId}, '{joinDate}', {share}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd


        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        # create DatabaseOperation object to execute the SQL clause
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

class Group(DialogFrame):
    """Creates a dialog to add group to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addGroupDialog.ui", self)

        self.setWindowTitle('Lisää ryhmä')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.addGroupGroupNameLE = self.addGroupGroupNameLineEdit
        self.addGroupPartyCB = self.addGroupPartyComboBox
        
        self.addGroupAddPushBtn = self.addGroupAddPushButton
        self.addGroupAddPushBtn.clicked.connect(self.addGroup) # Signal
        self.addGroupCancelPushBtn = self.addGroupCancelPushButton
        self.addGroupCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddGroupDialog()
    
    
    def populateAddGroupDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue') # TODO: Make own view to filter members who already have membership
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.partyIdList = prepareData.prepareComboBox(
                databaseOperation, self.addGroupPartyCB, 2, 0)


    def addGroup(self):
        try:
            partyChosenItemIx = self.addGroupPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            groupName = self.addGroupGroupNameLE.text()

            errorCode = 0
            if groupName == '':
                errorCode = 1

            sqlClauseBeginning = "INSERT INTO public.jakoryhma(seurue_id, ryhman_nimi) VALUES("
            sqlClauseValues = f"{partyId}, '{groupName}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä ryhmän nimi kenttä lisätäksesi ryhmän',
                '-'
                )
        else:
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
                self.addGroupGroupNameLE.clear()
            

    def closeDialog(self):
        self.close()

class Party(DialogFrame):
    """Creates a dialog to add party to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addPartyDialog.ui", self)

        self.setWindowTitle('Lisää seurue')

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        # Elements
        self.addPartyNameLE = self.addPartyNameLineEdit
        self.addPartyLeaderCB = self.addPartyLeaderComboBox
        
        self.addPartyAddPushBtn = self.addPartyAddPushButton
        self.addPartyAddPushBtn.clicked.connect(self.addParty) # Signal
        self.addPartyCancelPushBtn = self.addPartyCancelPushButton
        self.addPartyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateAddPartyDialog()
    
    def populateAddPartyDialog(self):
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
                databaseOperation2, self.addPartyLeaderCB, 1, 0)

    def addParty(self):
        try:
            companyId = 1
            partyName = self.addPartyNameLE.text()

            memberChosenItemIx = self.addPartyLeaderCB.currentIndex()
            partyLeaderId = self.memberIdList[memberChosenItemIx]

            errorCode = 0
            if partyName == '':
                errorCode = 1

            sqlClauseBeginning = "INSERT INTO public.seurue(seura_id, seurueen_nimi, jasen_id) VALUES("
            sqlClauseValues = f"{companyId}, '{partyName}', {partyLeaderId}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä seurueen nimi kenttä lisätäksesi seurueen',
                '-'
                )
        else:
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
                self.addPartyNameLE.clear()

    def closeDialog(self):
        self.close()
