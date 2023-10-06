from PyQt5.QtWidgets import (QWidget, QScrollArea, QMessageBox, QTableWidget, 
                             QTableWidgetItem, QDateEdit, QComboBox, QPushButton, QLabel)
from PyQt5 import QtCore
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.uic import loadUi
from datetime import date
import pgModule
import prepareData
import figures
import party

import dialogs.dialogueWindow as dialogueWindow


class Ui_shareMemberTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_shareMemberTabWidget, self).__init__()
        loadUi('ui/shareMemberTab.ui', self)
    
        self.currentDate = date.today()

        self.shareKillsMemberTW: QTableWidget = self.shareKillsTableWidget
        self.shareDE: QDateEdit = self.shareDateEdit
        self.sharePortionCB: QComboBox = self.portionComboBox
        self.shareMemberCB: QComboBox = self.memberComboBox
        self.sharePartyCB: QComboBox = self.partyComboBox
        self.sharePartyCB.currentIndexChanged.connect(self.handlePartyCBChange)
        
        self.shareSavePushBtn: QPushButton = self.shareSavePushButton
        self.shareSavePushBtn.clicked.connect(self.saveShare) # Signal
        self.sharedPortionsTW: QTableWidget = self.shareSharedPortionsTableWidget

        self.chosenItemLbl: QLabel = self.chosenItemLabel

        self.shareSankeyWebView: QWebEngineView = self.shareSankeyWebEngineView

        # Signal when the user clicks an item on shareKillsTW
        self.shareKillsMemberTW.itemClicked.connect(self.onShareKillTableClick)

                # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.populateSharePage()
        
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
    
    def populateSharePage(self):
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.jako_kaadot_jasenille')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            self.shareKillIdList = prepareData.prepareTable(databaseOperation1, self.shareKillsMemberTW)

        # Read data fom table ruhonosa and populate the combo box
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.ruhonosa')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.sharePortionText = prepareData.prepareComboBox(
                databaseOperation2, self.sharePortionCB, 0, 0)
        
        # Prepare the shared portions table
        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.jaetut_ruhon_osat_jasenille')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
                )
        else:
            try:
                # parse the data from the view to readable format
                tableData = prepareData.parseSharedPortionOfShot(databaseOperation4.resultSet)
                
                # Set row count and column headers to match the data
                databaseOperation4.rows = len(tableData)
                databaseOperation4.columnHeaders[2] = 'Jaettu'
                databaseOperation4.resultSet = tableData
                
                prepareData.prepareTable(databaseOperation4, self.sharedPortionsTW)
                self.sharedPortionsTW.setColumnHidden(4, True)
            except:
                self.alert(
                'Vakava virhe',
                'Jaetut taulukon luonti epäonnistui',
                'Shared kills failed to load on share page',
                'Oops'
            )
            
        
        databaseOperation5 = pgModule.DatabaseOperation()
        databaseOperation5.getAllRowsFromTableWithLimit(
            self.connectionArguments, 'public.seurue', 'seurue_tyyppi_id = 2')
        if databaseOperation5.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation5.errorMessage,
                databaseOperation5.detailedMessage
                )
        else:
            self.sharePartyText = prepareData.prepareComboBox(
                databaseOperation5, self.sharePartyCB, 2, 0)
            
            for i in range(len(self.sharePartyText)):
                self.sharePartyCB.setItemData(i, databaseOperation5.resultSet[i])
                
        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.jasenyys_nimella')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
                )
        else:
            self.membershipData = databaseOperation6.resultSet
            self.handlePartyCBChange()
        
        
        # Set the chosen shot label to empty
        self.chosenItemLbl.setText("Ei valittua kaatoa")
        
        # Disable the save button
        self.shareSavePushBtn.setEnabled(False)
    
    def onShareKillTableClick(self, item: QTableWidgetItem):
        """Method for handling the click event on the table

        Args:
            item (QTableWidgetItem): Item clicked in the table
        """
        selectedRow = item.row()
        self.shotUsageId = int(self.shareKillsMemberTW.item(selectedRow, 10).text())
        self.shotWeight = float(self.shareKillsMemberTW.item(selectedRow, 9).text())
        self.chosenItemLbl.setText(f"Valittu Kaato ID: {self.shareKillsMemberTW.item(selectedRow, 0).text()}")
        self.shareSavePushBtn.setEnabled(True)
           
    def saveShare(self):
        """Method for saving the member share to the database
        """
        
        # Dictionary for converting portion names to relevant multipliers
        portionDict = {
            "Neljännes": 0.25,
            "Puolikas": 0.5,
            "Koko": 1,
        }
        
        try:
            # Read data from the widgets and data stored when the user clicked the table
            shotUsageId = int(self.shotUsageId)
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = portionDict[portion] * self.shotWeight
            shareMembership = self.shareMemberCB.currentData()
            
            # Create SQL query
            sqlClauseBeginning = f"INSERT INTO public.jakotapahtuma_jasen(paiva, kaadon_kasittely_id, osnimitys, jasenyys_id, maara) VALUES("
            sqlClauseValues = f"'{shareDay}', {shotUsageId!r}, {portion!r}, {shareMembership!r}, {weight!r}"
            sqlClauseEnd = ");"
            
            # Assemble the query
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert(
                'Vakava virhe',
                'Tietojen lukeminen epäonnistui',
                'Tarkista, että olet valinnut kaadon ja jäsenen',
                ''
                )
            return
        
        # Execute the query
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
            # Update the table
            self.populateSharePage()
            self.shareSavePushBtn.setEnabled(False)
   
    def handlePartyCBChange(self):
        """Method for handling the change event on the party combo box
        """
        if self.sharePartyCB.currentData() == None:
            return
        
        currentPartyId = self.sharePartyCB.currentData()[0]
        
        self.shareMemberCB.clear()
        
        for i, item in enumerate(self.membershipData):
            if item[2] == currentPartyId:
                # (member name, membership id)
                self.shareMemberCB.addItem(item[1], item[0])