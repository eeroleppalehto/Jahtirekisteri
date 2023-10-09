
from PyQt5.QtWidgets import QWidget, QScrollArea, QFrame, QVBoxLayout, QMessageBox, QPushButton, QTableWidget, QComboBox
from PyQt5.QtCore import Qt
from PyQt5.uic import loadUi
import pgModule
import prepareData

import dialogs.dialogueWindow as dialogueWindow

# import dialogs.addDialogueWindow as addDialogueWindow
import dialogs.addDialogues.Member as addDialogueWindowMember
import dialogs.addDialogues.Membership as addDialogueWindowMembership
import dialogs.addDialogues.Group as addDialogueWindowGroup
import dialogs.addDialogues.Party as addDialogueWindowParty

import dialogs.removeDialogues.Group as removeDialogueWindowGroup
import dialogs.removeDialogues.Member as removeDialogueWindowMember
import dialogs.removeDialogues.Party as removeDialogueWindowParty
import dialogs.removeDialogues.Membership as removeDialogueWindowMembership

import dialogs.editDialogues.Company as editDialogueWindowCompany
import dialogs.editDialogues.Group as editDialogueWindowGroup
import dialogs.editDialogues.Member as editDialogueWindowMember
import dialogs.editDialogues.Membership as editDialogueWindowMembership
import dialogs.editDialogues.Party as editDialogueWindowParty


class Ui_maintenanceTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_maintenanceTabWidget, self).__init__()
        loadUi('ui/maintenanceTab.ui', self)

        self.maintenanceAddMemberPushBtn: QPushButton = self.maintenanceAddMemberPushButton
        self.maintenanceAddMemberPushBtn.clicked.connect(self.openAddMemberDialog) # Signal
        self.maintenanceRemoveMemberPushBtn: QPushButton = self.maintenanceRemoveMemberPushButton
        self.maintenanceRemoveMemberPushBtn.clicked.connect(self.openRemoveMemberDialog) # Signal
        self.maintenanceAddMembershipPushBtn: QPushButton = self.maintenanceAddMembershipPushButton
        self.maintenanceAddMembershipPushBtn.clicked.connect(self.openAddMembershipDialog) # Signal
        self.maintenanceAddGroupPushBtn: QPushButton = self.maintenanceAddGroupPushButton
        self.maintenanceAddGroupPushBtn.clicked.connect(self.openAddGroupDialog) # Signal
        self.maintenanceRemoveGroupPushBtn: QPushButton = self.maintenanceRemoveGroupPushButton
        self.maintenanceRemoveGroupPushBtn.clicked.connect(self.openRemoveGroupDialog) # Signal
        self.maintenanceAddPartyPushBtn: QPushButton = self.maintenanceAddPartyPushButton
        self.maintenanceAddPartyPushBtn.clicked.connect(self.openAddMPartyDialog) # Signal
        self.maintenanceRemovePartyPushBtn: QPushButton = self.maintenanceRemovePartyPushButton
        self.maintenanceRemovePartyPushBtn.clicked.connect(self.openRemovePartyDialog) # Signal
        self.maintenanceEditCompanyPushBtn: QPushButton = self.maintenanceEditCompanyPushButton
        self.maintenanceEditCompanyPushBtn.clicked.connect(self.openEditCompanyDialog) # Signal
        self.maintenanceEditMemberPushBtn: QPushButton = self.maintenanceEditMemberPushButton
        self.maintenanceEditMemberPushBtn.clicked.connect(self.openEditMemberDialog) # Signal
        self.maintenanceEditMembershipPushBtn: QPushButton = self.maintenanceEditMembershipPushButton
        self.maintenanceEditMembershipPushBtn.clicked.connect(self.openEditMembershipDialog) # Signal
        self.maintenanceEditGroupPushBtn: QPushButton = self.maintenanceEditGroupPushButton
        self.maintenanceEditGroupPushBtn.clicked.connect(self.openEditGroupDialog) # Signal
        self.maintenanceEditPartyPushBtn: QPushButton = self.maintenanceEditPartyPushButton
        self.maintenanceEditPartyPushBtn.clicked.connect(self.openEditPartyDialog) # Signal
        
        self.maintenanceRemoveMembershipPB: QPushButton = self.maintenanceRemoveMembershipPushButton
        self.maintenanceRemoveMembershipPB.clicked.connect(self.openRemoveMembershipDialog)
        

        self.maintenanceTW: QTableWidget = self.maintenanceTableWidget
        self.maintenanceTableCB: QComboBox = self.maintenanceComboBox
        
        self.maintenanceSortCB: QComboBox = self.maintenanceSortComboBox

        cbOptionsList = ["Kaikki jäsenet", "Ryhmät jäsenillä", "Seurue ryhmillä"]

        self.maintenanceCB.addItems(cbOptionsList)

        self.maintenanceCB.currentIndexChanged.connect(self.populateMaintenancePage)

        # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.populateMaintenancePage()

    def alert(self, windowTitle, alertMsg, additionalMsg, details):
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

    def populateMaintenancePage(self):
        optionDict = {
            "Kaikki jäsenet": "public.jasen_tila",
            "Ryhmät jäsenillä": "public.ryhmat_jasenilla",
            "Seurue ryhmillä": "public.seurue_ryhmilla",
        }

        tableToShow = optionDict[self.maintenanceCB.currentText()]

        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, tableToShow)
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareTable(databaseOperation1, self.maintenanceTW)

    
    def handleTableOptionChange(self):
        """
            Handles the change of the table option combo box and changes
            the sort options combo box accordingly and populates the table
        """
        
        
        memberTableOptions = [
            "Nimi \u2193",
            "Nimi \u2191",
            "Osoite \u2193",
            "Osoite \u2191",
            "Postinumero \u2193",
            "Postinumero \u2191",
            "Postitoimipaikka \u2193",
            "Postitoimipaikka \u2191",
            "Tila \u2193",
            "Tila \u2191"
        ]
        
        groupTableOptions = [
            "Ryhmän nimi \u2193",
            "Ryhmän nimi \u2191",
            "Nimi \u2193",
            "Nimi \u2191",
            "Liittynyt \u2193",
            "Liittynyt \u2191",
            "Poistunut \u2193",
            "Poistunut \u2191",
            "Osuus \u2193",
            "Osuus \u2191"
        ]
        
        partyTableOptions = [
            "Seurueen nimi \u2193",
            "Seurueen nimi \u2191",
            "Ryhmän nimi \u2193",
            "Ryhmän nimi \u2191"
        ]
        
        # Check which table is selected and populate the sort options combo box accordingly
        if self.maintenanceTableCB.currentText() == "Kaikki jäsenet":
            self.maintenanceSortCB.clear()
            self.maintenanceSortCB.addItems(memberTableOptions)
            
        elif self.maintenanceTableCB.currentText() == "Ryhmät jäsenillä":
            self.maintenanceSortCB.clear()
            self.maintenanceSortCB.addItems(groupTableOptions)
            
        elif self.maintenanceTableCB.currentText() == "Seurue ryhmillä":
            self.maintenanceSortCB.clear()
            self.maintenanceSortCB.addItems(partyTableOptions)
        
        self.populateMaintenancePage()

    #SIGNALS
    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

    def openAddMemberDialog(self):
        dialog = addDialogueWindowMember.Member()
        dialog.exec()
    
    def openRemoveMemberDialog(self):
        dialog = removeDialogueWindowMember.Member()
        dialog.exec()
    
    def openAddMembershipDialog(self):
        dialog = addDialogueWindowMembership.Membership()
        dialog.exec()
    
    def openAddGroupDialog(self):
        dialog = addDialogueWindowGroup.Group()
        dialog.exec()

    def openRemoveGroupDialog(self):
        dialog = removeDialogueWindowGroup.Group()
        dialog.exec()
        
    def openRemoveMembershipDialog(self):
        dialog = removeDialogueWindowMembership.Membership()
        dialog.exec()

    def openAddMPartyDialog(self):
        dialog = addDialogueWindowParty.Party()
        dialog.exec()
    
    def openRemovePartyDialog(self):
        dialog = removeDialogueWindowParty.Party()
        dialog.exec()
    
    def openEditCompanyDialog(self):
        dialog = editDialogueWindowCompany.Company()
        dialog.exec()

    def openEditMemberDialog(self):
        dialog = editDialogueWindowMember.Member()
        dialog.exec()

    def openEditMembershipDialog(self):
        dialog = editDialogueWindowMembership.Membership()
        dialog.exec()
    
    def openEditGroupDialog(self):
        dialog = editDialogueWindowGroup.Group()
        dialog.exec()

    def openEditPartyDialog(self):
        dialog = editDialogueWindowParty.Party()
        dialog.exec()
