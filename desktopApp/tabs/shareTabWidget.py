
from PyQt5.QtWidgets import QWidget, QScrollArea, QMessageBox, QPushButton
from PyQt5 import QtCore
from PyQt5.uic import loadUi
from datetime import date
import pgModule
import prepareData
import figures
import party

import dialogs.dialogueWindow as dialogueWindow
import dialogs.editDialogues.Share as editShareDialog


class Ui_shareTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_shareTabWidget, self).__init__()
        loadUi('ui/shareTab.ui', self)

        self.currentDate = date.today()

        self.shareKillsTW: QTableWidget = self.shareKillsTableWidget
        self.shareDE: QDateEdit = self.shareDateEdit
        self.sharePortionCB: QComboBox = self.portionComboBox
        self.shareGroupCB: QComboBox = self.groupComboBox
        self.shareSavePushBtn: QPushButton = self.shareSavePushButton
        self.shareSavePushBtn.clicked.connect(self.saveShare) # Signal
        self.shareEditPushBtn: QPushButton = self.shareEditPushButton
        self.shareEditPushBtn.clicked.connect(self.openEditShareDialog) # Signal
        self.sharedPortionsTW: QTableWidget = self.shareSharedPortionsTableWidget
        
        self.sortKillsCB: QComboBox = self.sortKillsComboBox
        self.sortKillsCB.currentIndexChanged.connect(self.sortKills)
        self.sortSharesCB: QComboBox = self.sortSharesComboBox
        self.sortSharesCB.currentIndexChanged.connect(self.sortShares)

        self.shareSankeyWebView = self.shareSankeyWebEngineView

        # Signal when the user clicks an item on shareKillsTW
        self.shareKillsTW.itemClicked.connect(self.onShareKillTableClick)

                # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.populateSharePage()

    # SLOTS
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

            # Read database connection arguments from the settings file


    def populateSharePage(self):
        # Set default date to current date
        self.shareDE.setDate(self.currentDate)

        # Prepare shot table widget
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.jako_kaadot')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            # sharekills = databaseOperation1.resultSet
            self.shareKillIdList = prepareData.prepareTable(databaseOperation1, self.shareKillsTW)
        
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
        
        # Prepare portion combo box
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
            self.shareGroupIdList = prepareData.prepareComboBox(
                databaseOperation3, self.shareGroupCB, 2, 0)

        # Data for Sankey graph
        databaseOperation5 = pgModule.DatabaseOperation()
        databaseOperation5.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue_lihat_osuus')
        if databaseOperation5.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation5.errorMessage,
                databaseOperation5.detailedMessage
                )
        else:
            partyData = databaseOperation5.resultSet

        # Data for Sankey graph
        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_osuus_maara')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
                )
        else:
            groupList = databaseOperation6.resultSet

        # Process data for sankey graph and then load it UI
        try:
            # Generate source colors for sankey graph
            sourceColors = figures.colors(len(partyData))

            # Generate sankey data and colors for groups
            partySankeyData = []
            partyColors = []
            for partyTuple in partyData:
                newParty = party.Party(partyTuple[0], partyTuple[1], partyTuple[2], partyTuple[3])
                newParty.setGroups(groupList)
                partySankeyData += newParty.setSankeyData()
                partyColors += newParty.getSankeyColors()
    
            labelColors = sourceColors + partyColors
        
            htmlFile = 'partystreams.html'
            urlString = f'file:///{htmlFile}'
            figure = figures.createSankeyChart(partySankeyData, [], labelColors, [], 'Seurueet')
            figures.createOfflineFile(figure, htmlFile) # Write the chart to a html file 'sankey.html'
            url = QtCore.QUrl(urlString) # Create a relative url to the file
            self.shareSankeyWebView.load(url) # Load it into the web view element
        except:
            self.alert(
                'Vakava virhe',
                'Sankey-kaavion luonti epäonnistui',
                'Sankey diagram failed to load on share page',
                'Oops'
            )

        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.jaetut_ruhon_osat')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
                )
        else:
            # Process data to be shown in sharedPortionsTableWidget
            try:
                # parse the data from the view to readable format
                tableData = prepareData.parseSharedPortionOfShot(databaseOperation6.resultSet)
                
                # Set row count and column headers to match the data
                databaseOperation6.rows = len(tableData)
                databaseOperation6.columnHeaders[2] = 'Jaettu'
                databaseOperation6.resultSet = tableData
                
                prepareData.prepareTable(databaseOperation6, self.sharedPortionsTW)
                self.sharedPortionsTW.setColumnHidden(4, True)
            except:
                self.alert(
                'Vakava virhe',
                'Jaetut taulukon luonti epäonnistui',
                'Shared kills failed to load on share page',
                'Oops'
            )
        
        # Clear and populate sort combo boxes
        sortKillsOptions = [
            'Kaato ID \u2193',
            'Kaato ID \u2191',
            'Kaataja \u2193',
            'Kaataja \u2191',
            'Kaatopäivä \u2193',
            'Kaatopäivä \u2191',
            'Paikka \u2193',
            'Paikka \u2191',
            'Eläin \u2193',
            'Eläin \u2191',
            'Ikäluokka \u2193',
            'Ikäluokka \u2191',
            'Sukupuoli \u2193',
            'Sukupuoli \u2191',
            'Paino \u2193',
            'Paino \u2191',
        ]
        
        sortSharesOptions = [
            'Kaato ID \u2193',
            'Kaato ID \u2191',
            'Eläin \u2193',
            'Eläin \u2191',
            'Jaettu \u2193',
            'Jaettu \u2191',
            'Määrä \u2193',
            'Määrä \u2191',
        ]

        self.sortKillsCB.clear()
        self.sortKillsCB.addItems(sortKillsOptions)
        self.sortSharesCB.clear()
        self.sortSharesCB.addItems(sortSharesOptions)
            
    def saveShare(self):
        errorCode = 0
        portionDict = {
            "Neljännes": 0.25,
            "Puolikas": 0.5,
            "Koko": 1,
        }
        try:
            shotUsageId = int(self.shotUsageId)
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = portionDict[portion]*float(self.shotWeight)
            shareGroupChosenItemIx = self.shareGroupCB.currentIndex()
            shareGroup = self.shareGroupIdList[shareGroupChosenItemIx]
            
            if self.shotUsageId == '':
                errorCode = 1
            
            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.jakotapahtuma(paiva, ryhma_id, osnimitys, maara, kaadon_kasittely_id) VALUES("
            sqlClauseValues = f"'{shareDay}', {shareGroup}, '{portion}', {weight}, {shotUsageId}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return

        # create DatabaseOperation object to execute the SQL clause

        if errorCode == 1:
            self.alert('Virheellinen syöte', 'Valitse jaettava kaato', '','Valitse jaettava kaato yllä olevasta taulukosta' )
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
            
            # Update the page to show new data and clear 
            self.populateSharePage()

    def onShareKillTableClick(self, item):
        selectedRow = item.row()
        self.shotUsageId = self.shareKillsTW.item(selectedRow, 10).text()
        self.shotWeight = float(self.shareKillsTW.item(selectedRow, 9).text())
        
    def openEditShareDialog(self):
        dialog = editShareDialog.Share()
        dialog.exec()

    def sortNumericCells(self, tableWidget: QTableWidget, columnNumber: int, databaseOperation: pgModule.DatabaseOperation, reverse: bool):
        """
            As the sortItems() method does not work with numeric values,
            we need to sort the data manually
            
            Args:
                tableWidget (QTableWidget): the table widget to sort
                columnNumber (int): the column number of the table to sort
                databaseOperation (pgModule.DatabaseOperation): the database operation object
                reverse (bool): reverse the order of the sort if True
                
        """
        
        databaseOperation.resultSet.sort(reverse=reverse, key=lambda x: float(x[columnNumber]))
        
        # Mount the data back to the TableWidget
        prepareData.prepareTable(databaseOperation, tableWidget)
        
    def sortPercentageCells(self, tableWidget: QTableWidget, columnNumber: int, databaseOperation: pgModule.DatabaseOperation, reverse: bool):
        """As the sortItems() method does not work with percentage values,
            we need to sort the data manually

        Args:
            tableWidget (QTableWidget): table widget to sort
            columnNumber (int): column number of the table to sort
            databaseOperation (pgModule.DatabaseOperation): database operation object with the data
            reverse (bool): reverse the order of the sort if True
        """
        
        databaseOperation.resultSet.sort(reverse=reverse, key=lambda x: self.parsePercentage(x[columnNumber]))
        
        # Mount the data back to the TableWidget
        prepareData.prepareTable(databaseOperation, tableWidget)

    def parsePercentage(self, percentageString: str):
        """
            Parses a string like '50%' to float 0.5
        """
        return float(percentageString.strip('%'))/100

    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()