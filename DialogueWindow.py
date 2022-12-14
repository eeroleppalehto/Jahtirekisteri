import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.uic import loadUi
import pgModule
import prepareData
from datetime import date

class DialogFrame(QDialog):
    """A Parent Class that has alert method implemented and 
    database connection attribute defined"""
    def __init__(self):
        super().__init__()

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('settings.dat')
    
        self.currentDate = date.today()

    def alert(self, windowTitle,alertMsg, additionalMsg, details):
        """Creates a message box for critical errors

        Args:
            windowTitle (str): Title of the message box
            alertMsg (str): Basic information about the error in Finnish
            additionalMsg (str): Additional information about the error in Finnish
            details (str): Technical details in English (from psycopg2)
        """

        alertDialog = QMessageBox() # Create a message box object
        alertDialog.setWindowTitle(windowTitle) # Add appropriate title to the message box
        alertDialog.setIcon(QMessageBox.Critical) # Set icon to critical
        alertDialog.setText(alertMsg) # Basic information about the error in Finnish
        alertDialog.setInformativeText(additionalMsg) # Additional information about the error in Finnish
        alertDialog.setDetailedText(details) # Technical details in English (from psycopg2)
        alertDialog.setStandardButtons(QMessageBox.Ok) # Only OK is needed to close the dialog
        alertDialog.exec_() # Open the message box
    

class SaveDBSettingsDialog(QDialog):
    """Creates a dialog to save database settings"""

    # Constructor
    def __init__(self):
        super().__init__()

        loadUi("saveDBSettingsDialog.ui", self)

        self.setWindowTitle('Tietokantapalvelimen asetukset')

        # Elements
        self.hostLE = self.hostLineEdit
        self.portSB = self.portSpinBox
        self.databaseLE = self.databaseLineEdit
        self.userLE = self.userLineEdit
        self.passwordLE = self.passwordLineEdit
        self.cancelPB = self.cancelPushButton
        self.savePB = self.savePushButton
        # Signals
        self.cancelPB.clicked.connect(self.closeDialog)
        self.savePB.clicked.connect(self.saveSettings)
    

        # Set values of elements according to the current settings
        # Create an object to use setting methods

        self.databaseOperation = pgModule.DatabaseOperation() # Needed in slots -> self # FIXME: Uncomment + add pgModule
        currentSettings = self.databaseOperation.readDatabaseSettingsFromFile(
            'settings.dat')  # Read current settings, needed only in the constructor
        self.hostLE.setText(currentSettings['server'])  # Server's host name
        # Port number, spin box uses integer values
        self.portSB.setValue(int(currentSettings['port']))
        self.databaseLE.setText(currentSettings['database'])
        self.userLE.setText(currentSettings['user'])
        self.passwordLE.setText(currentSettings['password'])


    # Slots

    # Peru button closes the dialog
    def closeDialog(self):
        self.close()

    # Tallenna button saves modified settings to a file and closes the dialog
    def saveSettings(self):
        # TODO: Finish
        server = self.hostLE.text()
        # Port is string in the settings file, integer in the spin box
        port = str(self.portSB.value())
        database = self.databaseLE.text()
        user = self.userLE.text()
        password = self.passwordLE.text()



        # Build new connection arguments
        newSettings = self.databaseOperation.createConnectionArgumentDict(
            database, user, password, server, port)
        
        # Save arguments to a json file
        self.databaseOperation.createConnectionArgumentDict(
            'connectionSettings.dat', newSettings)
        self.close()

class AddMemberDialog(DialogFrame):
    """Creates a dialog to add member to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("addMemberDialog.ui", self)

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
        self.addMemberAddPushBtn.clicked.connect(self.closeDialog) # Signal
    

    def addMember(self):
        # TODO: dbConnection...insertRow...try/catch...
        try:
            firstName = self.addMemberFirstNameLE.text()
            lastName = self.addMemberLastNameLE.text()
            postAddress = self.addMemberPostalAddressLE.text()
            zipCode = self.addMemberZIPLE.text()
            city = self.addMemberCityLE.text()

            sqlClauseBeginning = "INSERT INTO public.jasen(etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
            sqlClauseValues = f"'{firstName}', '{lastName}', '{postAddress}', '{zipCode}', '{city}'"
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
            self.addMemberFirstNameLE.clear()
            self.addMemberLastNameLE.clear()
            self.addMemberPostalAddressLE.clear()
            self.addMemberZIPLE.clear()
            self.addMemberCityLE.clear()


    def closeDialog(self):
        self.close()

class RemoveMemberDialog(DialogFrame):
    """Creates a dialog to remove member from database"""
    # TODO: Change from using delete from database to changing members status to deactive('poistunut')
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("removeMemberDialog.ui", self)

        self.setWindowTitle('Poista jäsen')

        # Elements
        self.removeMemberCB = self.removeMemberComboBox
        
        self.removeMemberPushBtn = self.removeMemberPushButton
        self.removeMemberPushBtn.clicked.connect(self.removeMember) # Signal
        self.removeMemberCancelPushBtn = self.removeMemberCancelPushButton
        self.removeMemberCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        # Populate the member combo box
        self.populateRemoveMemberDialog()

    

    def populateRemoveMemberDialog(self):
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
                databaseOperation2, self.removeMemberCB, 1, 0)
    

    def removeMember(self):
        # TODO: dbConnection...deleteRow...try/catch...
        try:
            memberChosenItemIx = self.removeMemberCB.currentIndex()
            memberId = self.memberIdList[memberChosenItemIx]
            
            table = 'public.jasen'
            limit = f"public.jasen.jasen_id = {memberId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, table, limit)
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
            self.populateRemoveMemberDialog()

    def closeDialog(self):
        self.close()

class AddMembershipDialog(DialogFrame):
    """Creates a dialog to add membership to database"""
    
    # Constructor
    def __init__(self):

        # TODO: set current day as default
        super().__init__()

        loadUi("addMembershipDialog.ui", self)

        self.setWindowTitle('Lisää jäsen ryhmään')

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
        # TODO: dbConnection...insertRow...try/catch...
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

class AddGroupDialog(DialogFrame):
    """Creates a dialog to add group to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("addGroupDialog.ui", self)

        self.setWindowTitle('Lisää ryhmä')

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
            self.connectionArguments, 'public.jasen') # TODO: Make own view to filter members who already have membership
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
        # TODO: dbConnection...insertRow...try/catch...
        try:
            partyChosenItemIx = self.addGroupPartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            groupName = self.addGroupGroupNameLE.text()

            sqlClauseBeginning = "INSERT INTO public.jakoryhma(seurue_id, ryhman_nimi) VALUES("
            sqlClauseValues = f"'{partyId}', '{groupName}'"
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
            self.addGroupGroupNameLE.clear()
            

    def closeDialog(self):
        self.close()

class RemoveGroupDialog(DialogFrame):
    """Creates a dialog to remove group from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("removeGroupDialog.ui", self)

        self.setWindowTitle('Poista ryhmä')

        # Elements
        self.removeGroupCB = self.removeGroupComboBox
        
        
        self.removeGroupRemovePushBtn = self.removeGroupRemovePushButton
        self.removeGroupRemovePushBtn.clicked.connect(self.removeGroup) # Signal
        self.removeGroupCancelPushBtn = self.removeGroupCancelPushButton
        self.removeGroupCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateRemoveGroupDialog()
    

    def populateRemoveGroupDialog(self):
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
                databaseOperation2, self.removeGroupCB, 2, 0)
    
    def removeGroup(self):
        # TODO: dbConnection...deleteRow...try/catch...
        try:
            groupChosenItemIx = self.removeGroupCB.currentIndex()
            groupId = self.groupIdList[groupChosenItemIx]
            
            table = 'public.jakoryhma'
            limit = f"public.jakoryhma.ryhma_id = {groupId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, table, limit)
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
            self.populateRemoveGroupDialog()

    def closeDialog(self):
        self.close()

class AddPartyDialog(DialogFrame):
    """Creates a dialog to add party to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("addPartyDialog.ui", self)

        self.setWindowTitle('Lisää seurue')

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
        # TODO: dbConnection...insertRow...try/catch...
        try:
            companyId = 1
            partyName = self.addPartyNameLE.text()

            memberChosenItemIx = self.addPartyLeaderCB.currentIndex()
            partyLeaderId = self.memberIdList[memberChosenItemIx]

            sqlClauseBeginning = "INSERT INTO public.seurue(seura_id, seurueen_nimi, jasen_id) VALUES("
            sqlClauseValues = f"{companyId}, '{partyName}', {partyLeaderId}"
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
            self.addPartyNameLE.clear()

    def closeDialog(self):
        self.close()

class RemovePartyDialog(DialogFrame):
    """Creates a dialog to remove party from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("removePartyDialog.ui", self)

        self.setWindowTitle('Poista seurue')

        # Elements
        self.removePartyCB = self.removePartyComboBox
        
        
        self.removePartyRemovePushBtn = self.removePartyRemovePushButton
        self.removePartyRemovePushBtn.clicked.connect(self.removeParty) # Signal
        self.removePartyCancelPushBtn = self.removePartyCancelPushButton
        self.removePartyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateRemovePartyDialog()
    

    def populateRemovePartyDialog(self):
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
                databaseOperation2, self.removePartyCB, 2, 0)

    def removeParty(self):
        # TODO: dbConnection...deleteRow...try/catch...
        try:
            partyChosenItemIx = self.removePartyCB.currentIndex()
            partyId = self.partyIdList[partyChosenItemIx]
            
            table = 'public.seurue'
            limit = f"public.seurue.seurue_id = {partyId}"
        except Exception:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, table, limit)
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
            self.populateRemovePartyDialog()

    def closeDialog(self):
        self.close()

class EditCompanyDialog(DialogFrame):
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

class EditMemberDialog(DialogFrame):
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

class EditMembershipDialog(DialogFrame):
    """docstring for EditMemberDialog(DialogFrame
    def __init__(self, arg):
        super(EditMemberDialog(DialogFrame).__init__()
    arg"""

    def __init__(self):

        super().__init__()

        loadUi("editMembershipDialog.ui", self)

        self.setWindowTitle('Muokkaa jäsenyys tietoja')
        
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

        self.populateMembershipTW()

    def populateMembershipTW(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jasenyys_nimella')
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
        currentRow = self.editMembershipTW.currentRow()
        
        memberCBIx = self.editMembershipMemberCB.findText(self.editMembershipTW.itemAt(0, currentRow).text(), Qt.MatchFixedString)
        print(self.editMembershipTW.itemAt(0, currentRow).text() + ", " + self.editMembershipTW.itemAt(1, currentRow).text())
        if memberCBIx >= 0:
            self.editMembershipMemberCB.setCurrentIndex(memberCBIx)
        else:
            print("No match") # TODO: Remove in production

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

class EditGroupDialog(DialogFrame):
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

class TestMainWindow(QMainWindow):
    """Main Window for testing dialogs."""

    def __init__(self):
        super().__init__()

        self.setWindowTitle('Pääikkuna dialogien testaukseen')

        # Add dialogs to be tested here and run them as follows:
        saveDBSettingsDialog = EditMembershipDialog()
        saveDBSettingsDialog.exec()

class SuccessfulOperationDialog(QDialog):
    def __init__(self):

        super().__init__()

        loadUi("successfulOperationDialog.ui", self)

        self.setWindowTitle('Onnistui!')

        self.successOkPushBtn = self.successOkPushButton
        self.successOkPushBtn.clicked.connect(self.closeDialog)
    
    def closeDialog(self):
        self.close()

# TODO: Edit dialogs for party. Possible to have a parent class for editDialogs?
# TODO: Add dialog window for suggestion in share tab

# Some tests
if __name__ == "__main__":

    # Create a testing application
    testApp = QApplication(sys.argv)

    # Create a main window for testing a dialog
    testMainWindow = TestMainWindow()
    testMainWindow.show()

    # Run the testing application
    testApp.exec()