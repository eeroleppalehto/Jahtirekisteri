
from PyQt5.QtWidgets import QWidget, QScrollArea, QMessageBox, QTableWidget
from PyQt5 import QtCore
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.uic import loadUi
import pgModule
import prepareData
import figures
import party

import dialogs.dialogueWindow as dialogueWindow


class Ui_summaryTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_summaryTabWidget, self).__init__()
        loadUi('ui/summaryTab.ui', self)

        # self.scrollArea = QScrollArea()
        # self.setCentralWidget(self.scrollArea)

        # Summary page (Yhteenveto)
        self.summaryMeatSharedTW: QTableWidget = self.meatSharedTableWidget
        self.summaryGroupSummaryTW: QTableWidget = self.groupSummaryTableWidget
        self.sankeyWebV: QWebEngineView = self.sankeyWebEngineView

        # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.populateSummaryPage()
    
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


    def populateSummaryPage(self):

        # Read data from view jaetut_lihat
        databaseOperation1 = pgModule.DatabaseOperation()
        
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.jaetut_lihat')
        
        #Check if an error has occurred
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareTable(databaseOperation1, self.summaryMeatSharedTW)

        # Read data from view jakoryhma_yhteenveto
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_yhteenveto')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
        else:
            self.groupSummary = databaseOperation2.resultSet
            prepareData.prepareTable(
                databaseOperation2, self.summaryGroupSummaryTW)

        # Data for Sankey graph
        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_elain_kasittely_seurue')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
                )
        else:
            sankeyAnimalHandle = databaseOperation4.resultSet
        
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
            # Extract lables from sankeydata
            labels = []
            for row in sankeyAnimalHandle:
                labels.append(row[0])
                labels.append(row[1])

            # Remove duplicates
            labels = list(dict.fromkeys(labels))

            # Generate colors for the labels
            labelColors = figures.colors(len(labels))

            # Generate sankey data and colors for groups
            partySankeyData = []
            partyColors = []
            for partyTuple in partyData:
                newParty = party.Party(partyTuple[0], partyTuple[1], partyTuple[2], partyTuple[3])
                newParty.setGroups(groupList)
                partySankeyData += newParty.setSankeyData()
                partyColors += newParty.getSankeyColors()

            labelColors += partyColors
            sankeydata = sankeyAnimalHandle + partySankeyData
            htmlFile = 'meatstreams.html'
            urlString = f'file:///{htmlFile}'
            figure = figures.createSankeyChart(sankeydata, [], labelColors, [], 'Sankey')
            figures.createOfflineFile(figure, htmlFile) # Write the chart to a html file 'sankey.html'
            url = QtCore.QUrl(urlString) # Create a relative url to the file
            self.sankeyWebV.load(url) # Load it into the web view element
        except:
            self.alert(
                'Vakava virhe',
                'Sankey-kaavion luonti epäonnistui',
                'Sankey diagram failed to load on summary page',
                'Oops'
            )

    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()
