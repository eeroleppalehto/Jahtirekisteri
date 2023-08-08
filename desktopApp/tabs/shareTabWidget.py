
from PyQt5.QtWidgets import QWidget, QScrollArea, QMessageBox
from PyQt5 import QtCore
from PyQt5.uic import loadUi
from datetime import date
import pgModule
import prepareData
import figures
import party

import dialogs.dialogueWindow as dialogueWindow


class Ui_shareTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_shareTabWidget, self).__init__()
        loadUi('ui/shareTab.ui', self)

        self.currentDate = date.today()

        self.shareKillsTW = self.shareKillsTableWidget
        self.shareDE = self.shareDateEdit
        self.sharePortionCB = self.portionComboBox
        self.shareAmountLE = self.amountLineEdit
        self.shareGroupCB = self.groupComboBox
        self.shareSavePushBtn = self.shareSavePushButton
        self.shareSavePushBtn.clicked.connect(self.saveShare) # Signal
        self.sharedPortionsTW = self.shareSharedPortionsTableWidget

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
                sharedPortionsData = databaseOperation6.resultSet

                # Generate id to new list and remove duplicates
                sharedKillsListID = [ row[0] for row in sharedPortionsData ]
                sharedKillsListID = list(dict.fromkeys(sharedKillsListID))

                # Modify database attributes to accommodate for edited table
                databaseOperation6.columnHeaders[2] = 'Jaettu'
                databaseOperation6.rows = len(sharedKillsListID)

                portionDict = {'Koko': 4, 'Puolikas': 2, 'Neljännes': 1}

                # Iterate through result set and sum amounts and portions for each id
                newData = []
                for id in sharedKillsListID:
                    animal = ""
                    sharedPortions = 0
                    amount = 0
                    shotUsagePortion = 0

                    for row in sharedPortionsData:
                        if row[0] == id:
                            animal = row[1]
                            sharedPortions += portionDict[row[2]]
                            amount += row[3]
                            shotUsagePortion += row[4]/100
                    sharedPortions = f"{int(sharedPortions*100/(4*shotUsagePortion))}%"
                    newData.append((id, animal, sharedPortions, amount))
                
                # Replace resultSet with new data
                databaseOperation6.resultSet = newData
                prepareData.prepareTable(databaseOperation6, self.sharedPortionsTW)
                self.sharedPortionsTW.setColumnHidden(4, True)
            except:
                self.alert(
                'Vakava virhe',
                'Jaetut taulukon luonti epäonnistui',
                'Shared kills failed to load on share page',
                'Oops'
            )

            
    def saveShare(self):
        errorCode = 0
        try:
            shotUsageId = int(self.shotUsageId)
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = float(self.shareAmountLE.text())
            shareGroupChosenItemIx = self.shareGroupCB.currentIndex()
            shareGroup = self.shareGroupIdList[shareGroupChosenItemIx]
            
            if self.shotUsageId == '':
                errorCode = 1
            
            if self.shareAmountLE.text() == '':
                errorCode = 2
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
        elif errorCode == 2:
            self.alert('Virheellinen syöte', 'Tarvittavat kentät ei ole täytetty', '','Täytä paino kenttä' )
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
            self.shareAmountLE.clear()

    def onShareKillTableClick(self, item):
        selectedRow = item.row()
        self.shotUsageId = self.shareKillsTW.item(selectedRow, 10).text()


    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()