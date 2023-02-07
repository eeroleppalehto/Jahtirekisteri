import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.uic import loadUi
from dialogs.DialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule
import prepareData
from datetime import date

class Member(DialogFrame):
    """Creates a dialog to remove member from database"""
    # TODO: Change from using delete from database to changing members status to deactive('poistunut')
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removeMemberDialog.ui", self)

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

class Group(DialogFrame):
    """Creates a dialog to remove group from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removeGroupDialog.ui", self)

        self.setWindowTitle('Poista ryhmä')

        # Elements
        self.removeGroupCB = self.removeGroupComboBox
        
        
        self.removeGroupRemovePushBtn = self.removeGroupRemovePushButton
        self.removeGroupRemovePushBtn.clicked.connect(self.removeGroup) # Signal
        self.removeGroupCancelPushBtn = self.removeGroupCancelPushButton
        self.removeGroupCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateRemoveGroupDialog()
    

    def populateRemoveGroupDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.groupIdList = prepareData.prepareComboBox(
                databaseOperation, self.removeGroupCB, 2, 0)
    
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

class Party(DialogFrame):
    """Creates a dialog to remove party from database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/removePartyDialog.ui", self)

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
