
from PyQt5.QtWidgets import QWidget, QScrollArea, QFrame, QVBoxLayout, QMessageBox
from PyQt5.uic import loadUi
import pgModule
import prepareData

import dialogs.dialogueWindow as dialogueWindow
import dialogs.addDialogueWindow as addDialogueWindow
import dialogs.editDialogueWindow as editDialogueWindow

import dialogs.removeDialogues.Group as removeDialogueWindowGroup
import dialogs.removeDialogues.Member as removeDialogueWindowMember
import dialogs.removeDialogues.Party as removeDialogueWindowParty


class Ui_maintenanceTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_maintenanceTabWidget, self).__init__()
        loadUi('ui/maintenanceTab.ui', self)

        self.maintenanceAddMemberPushBtn = self.maintenanceAddMemberPushButton
        self.maintenanceAddMemberPushBtn.clicked.connect(self.openAddMemberDialog) # Signal
        self.maintenanceRemoveMemberPushBtn = self.maintenanceRemoveMemberPushButton
        self.maintenanceRemoveMemberPushBtn.clicked.connect(self.openRemoveMemberDialog) # Signal
        self.maintenanceAddMembershipPushBtn = self.maintenanceAddMembershipPushButton
        self.maintenanceAddMembershipPushBtn.clicked.connect(self.openAddMembershipDialog) # Signal
        self.maintenanceAddGroupPushBtn = self.maintenanceAddGroupPushButton
        self.maintenanceAddGroupPushBtn.clicked.connect(self.openAddGroupDialog) # Signal
        self.maintenanceRemoveGroupPushBtn = self.maintenanceRemoveGroupPushButton
        self.maintenanceRemoveGroupPushBtn.clicked.connect(self.openRemoveGroupDialog) # Signal
        self.maintenanceAddPartyPushBtn = self.maintenanceAddPartyPushButton
        self.maintenanceAddPartyPushBtn.clicked.connect(self.openAddMPartyDialog) # Signal
        self.maintenanceRemovePartyPushBtn = self.maintenanceRemovePartyPushButton
        self.maintenanceRemovePartyPushBtn.clicked.connect(self.openRemovePartyDialog) # Signal
        self.maintenanceEditCompanyPushBtn = self.maintenanceEditCompanyPushButton
        self.maintenanceEditCompanyPushBtn.clicked.connect(self.openEditCompanyDialog) # Signal
        self.maintenanceEditMemberPushBtn = self.maintenanceEditMemberPushButton
        self.maintenanceEditMemberPushBtn.clicked.connect(self.openEditMemberDialog) # Signal
        self.maintenanceEditMembershipPushBtn = self.maintenanceEditMembershipPushButton
        self.maintenanceEditMembershipPushBtn.clicked.connect(self.openEditMembershipDialog) # Signal
        self.maintenanceEditGroupPushBtn = self.maintenanceEditGroupPushButton
        self.maintenanceEditGroupPushBtn.clicked.connect(self.openEditGroupDialog) # Signal
        self.maintenanceEditPartyPushBtn = self.maintenanceEditPartyPushButton
        self.maintenanceEditPartyPushBtn.clicked.connect(self.openEditPartyDialog) # Signal

        self.maintenanceTW = self.maintenanceTableWidget
        self.maintenanceCB = self.maintenanceComboBox

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

            if tableToShow == "public.ryhma":
                pass

    #SIGNALS
    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

    def openAddMemberDialog(self):
        dialog = addDialogueWindow.Member()
        dialog.exec()
    
    def openRemoveMemberDialog(self):
        dialog = removeDialogueWindowMember.Member()
        dialog.exec()
    
    def openAddMembershipDialog(self):
        dialog = addDialogueWindow.Membership()
        dialog.exec()
    
    def openAddGroupDialog(self):
        dialog = addDialogueWindow.Group()
        dialog.exec()

    def openRemoveGroupDialog(self):
        dialog = removeDialogueWindowGroup.Group()
        dialog.exec()

    def openAddMPartyDialog(self):
        dialog = addDialogueWindow.Party()
        dialog.exec()
    
    def openRemovePartyDialog(self):
        dialog = removeDialogueWindowParty.Party()
        dialog.exec()
    
    def openEditCompanyDialog(self):
        dialog = editDialogueWindow.Company()
        dialog.exec()

    def openEditMemberDialog(self):
        dialog = editDialogueWindow.Member()
        dialog.exec()

    def openEditMembershipDialog(self):
        dialog = editDialogueWindow.Membership()
        dialog.exec()
    
    def openEditGroupDialog(self):
        dialog = editDialogueWindow.Group()
        dialog.exec()

    def openEditPartyDialog(self):
        dialog = editDialogueWindow.Party()
        dialog.exec()
