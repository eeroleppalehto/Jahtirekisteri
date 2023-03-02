# APPLICATON FOR SHOWING SUMMARY DATA ABOUT MEAT GIVEN TO SHARE GROUP
# ====================================================================

# LIBRARIES AND MODULES
# ---------------------

import sys  # Needed for starting the application
from PyQt5.QtWidgets import *  # All widgets
from PyQt5 import QtWebEngineWidgets, QtCore # For showing html content
from PyQt5.uic import loadUi
from PyQt5.QtCore import *  # FIXME: Everything,  change to individual components
from datetime import date
import pgModule
import prepareData
import dialogs.DialogueWindow as DialogueWindow
import dialogs.AddDialogueWindow as AddDialogueWindow
import dialogs.RemoveDialogueWindow as RemoveDialogueWindow
import dialogs.EditDialogueWindow as EditDialogueWindow
import dialogs.SuggestionDialog as SuggestionDialog
import figures

# CLASS DEFINITIONS FOR THE APP
# -----------------------------


class MultiPageMainWindow(QMainWindow):

    # Constructor, a method for creating objects from this class
    def __init__(self):
        QMainWindow.__init__(self)

        # Create an UI from the ui file
        loadUi('ui/MultiPageMainWindow.ui', self)

        # Read database connection arguments from the settings file
        databaseOperation = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        

        # UI ELEMENTS TO PROPERTIES
        # -------------------------

        # Create a status bar to show informative messages (replaces print function used in previous exercises)
        self.statusBar = QStatusBar()  # Create a status bar object
        # Set it as the status bar for the main window
        self.setStatusBar(self.statusBar)
        self.statusBar.show()  # Make it visible
        self.setWindowTitle('Jahtirekisteri')

        self.currentDate = date.today()

        # Summary page (Yhteenveto)
        self.summaryRefreshBtn = self.summaryRefreshPushButton
        self.summaryRefreshBtn.clicked.connect(
            self.populateSummaryPage)  # Signal
        self.summaryMeatSharedTW = self.meatSharedTableWidget
        self.summaryGroupSummaryTW = self.groupSummaryTableWidget
        self.sankeyWebV = self.sankeyWebEngineView

        # Kill page (Kaato)
        self.shotByCB = self.shotByComboBox
        self.shotDateDE = self.shotDateEdit
        self.shotLocationLE = self.locationLineEdit
        self.shotAnimalCB = self.animalComboBox
        self.shotAgeGroupCB = self.ageGroupComboBox
        self.shotGenderCB = self.genderComboBox
        self.shotWeightLE = self.weightLineEdit
        self.shotUsageCB = self.usageComboBox
        self.shotAddInfoTE = self.additionalInfoTextEdit
        self.shotSavePushBtn = self.saveShotPushButton
        self.shotSavePushBtn.clicked.connect(self.saveShot) # Signal
        self.shotKillsTW = self.killsKillsTableWidget

        # Share page (Lihanjako)
        self.shareKillsTW = self.shareKillsTableWidget
        self.shareDE = self.shareDateEdit
        self.sharePortionCB = self.portionComboBox
        self.shareAmountLE = self.amountLineEdit
        self.shareGroupCB = self.groupComboBox
        self.shareSavePushBtn = self.shareSavePushButton
        self.shareSavePushBtn.clicked.connect(self.saveShare) # Signal
        self.shareSuggestionPushBtn = self.shareSuggestionPushButton
        self.shareSuggestionPushBtn.clicked.connect(self.openSuggestionDialog) # Signal

        self.shareSankeyTabW = self.shareSankeyTabWidget
        self.shareMooseSankeyWebView = self.shareMooseSankeyWebEngineView
        self.shareDeerSankeyWebView= self.shareDeerSankeyWebEngineView

        # Signal when the user clicks an item on shareKillsTW
        self.shareKillsTW.itemClicked.connect(self.onShareKillTableClick)

        # License page (Luvat)
        self.licenseYearLE = self.licenseYearLineEdit
        self.licenseAnimalCB = self.licenseAnimalComboBox
        self.licenseAgeGroupCB = self.licenseAgeGroupComboBox
        self.licenseGenderCB = self.licenseGenderComboBox
        self.licenseAmountLE = self.licenseAmountLineEdit
        self.licenseSavePushBtn = self.licenseSavePushButton
        self.licenseSavePushBtn.clicked.connect(self.saveLicense) # Signal
        self.licenseSummaryTW = self.licenseSummaryTableWidget

        # Maintenance page (Ylläpito)
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

        # Signal when a page is opened
        self.pageTab = self.tabWidget
        self.pageTab.currentChanged.connect(self.populatePage)

        # Menu signals
        self.actionServerSettings.triggered.connect(self.openSettingsDialog)
        self.actionManual.triggered.connect(self.openManualDialog)

        # Signals other than emitted by UI elements
        self.populateAllPages()

    # SLOTS

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

    # A method to populate summaryPage's table widgets

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

        # Read data from view jakoryhma_yhteenveto, no need to read connection args twice
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

        # SankeyGraph
        # 
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_data')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            sankeyData = databaseOperation3.resultSet
        
        # TODO: Access groupdata and assign color values depending on delta of expected meat value
        # figures.colors(sankeyData, databaseOperation2.resultSet)
        # print(sankeyData)
        # figure = figures.testChart()
        htmlFile = 'meatstreams.html'
        urlString = f'file:///{htmlFile}'
        targetColors = figures.colors(sankeyData, self.groupSummary)
        figure = figures.createSankeyChart(sankeyData, [], targetColors, [], 'Sankey')
        figures.createOfflineFile(figure, htmlFile) # Write the chart to a html file 'sankey.html'
        url = QtCore.QUrl(urlString) # Create a relative url to the file
        self.sankeyWebV.load(url) # Load it into the web view element

    def populateKillPage(self):
        # Set default date to current date
        self.shotDateDE.setDate(self.currentDate)
        # Read data from view kaatoluettelo
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.kaatoluettelo')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareTable(databaseOperation1, self.shotKillsTW)

        # Read data from view nimivalinta
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
            self.shotByIdList = prepareData.prepareComboBox(
                databaseOperation2, self.shotByCB, 1, 0)

        # Read data from table elain and populate the combo box
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.elain')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            self.shotAnimalText = prepareData.prepareComboBox(
                databaseOperation3, self.shotAnimalCB, 0, 0)

        # Read data from table aikuinenvasa and populate the combo box
        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.aikuinenvasa')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
                )
        else:
            self.shotAgeGroupText = prepareData.prepareComboBox(
                databaseOperation4, self.shotAgeGroupCB, 0, 0)

        # Read data from table sukupuoli and populate the combo box
        databaseOperation5 = pgModule.DatabaseOperation()
        databaseOperation5.getAllRowsFromTable(
            self.connectionArguments, 'public.sukupuoli')
        if databaseOperation5.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation5.errorMessage,
                databaseOperation5.detailedMessage
                )
        else:
            self.shotGenderText = prepareData.prepareComboBox(
                databaseOperation5, self.shotGenderCB, 0, 0)

        # Read data from table kasittely
        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.kasittely')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
                )
        else:
            self.shotUsageIdList = prepareData.prepareComboBox(
                databaseOperation6, self.shotUsageCB, 1, 0)

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
            sharekills = databaseOperation1.resultSet
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

        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.jakoryhma_yhteenveto')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
                )
        else:
            self.groupSummary = databaseOperation4.resultSet

        databaseOperation5 = pgModule.DatabaseOperation() # TODO:Remove
        databaseOperation5.getAllRowsFromTable(
            self.connectionArguments, 'public.jaetut_hirvi')
        if databaseOperation5.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation5.errorMessage,
                databaseOperation5.detailedMessage
                )
        else:
            mooseData = databaseOperation5.resultSet
        
        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.seurue_ryhma_lihat')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
                )
        else:
            partyGroupData = databaseOperation6.resultSet

        # mooseSources = (row[0] for row in mooseData)
        # mooseSourcesNumber = len(set(mooseSources))

        # totalMoose = 0
        # totalDeer = 0
        

        # for data in sharekills:
        #     if data[4] == 'Hirvi':
        #         totalMoose += data[8]
        #     elif data[8] == 'Valkohäntäpeura':
        #         totalDeer += data[8]

        # htmlFile = 'moosestreams.html'
        # urlString = f'file:///{htmlFile}'
        # sourceColors = figures.colors2(mooseSourcesNumber)
        # groupColors = figures.groupColors(mooseData, self.groupSummary, totalMoose)
        # targetColors = sourceColors + groupColors
        # figure = figures.createSankeyChart(mooseData, [], targetColors, [], 'Hirvi')
        # figures.createOfflineFile(figure, htmlFile) # Write the chart to a html file 'sankey.html'
        # url = QtCore.QUrl(urlString) # Create a relative url to the file
        # self.shareMooseSankeyWebView.load(url) # Load it into the web view element

        # Party Sanky Chart
        partySources = (row[0] for row in partyGroupData)
        # Remove duplicates
        partySources = list(dict.fromkeys(partySources))
        
        sourceColors = figures.colors2(len(partySources))
        # Generate colors for groups
        targetColors = []
        for party in partySources:
            temp_sankeyData = []
            for row in partyGroupData:
                if row[0] == party and row[2] != None:
                    temp_sankeyData.append(row)

            weight=0
            for row in temp_sankeyData:
                if row[2] != None:
                    weight += row[2]

            temp_groupNames = [row[1] for row in temp_sankeyData]

            temp_groupShareData = []
            for row in self.groupSummary:
                if row[0] in temp_groupNames:
                    temp_groupShareData.append(row)
            print(temp_groupShareData)
            targetColors += figures.partyGroupColors(temp_sankeyData, temp_groupShareData)


        labelColors = sourceColors + targetColors
        print(labelColors)
        joku = []
        for i in partyGroupData:
            if i[2] !=None:
                joku.append(i)
        print(partyGroupData)
        htmlFile = 'partystreams.html'
        urlString = f'file:///{htmlFile}'
        figure = figures.createSankeyChart(joku, [], labelColors, [], 'Hope')
        figures.createOfflineFile(figure, htmlFile) # Write the chart to a html file 'sankey.html'
        url = QtCore.QUrl(urlString) # Create a relative url to the file
        self.shareMooseSankeyWebView.load(url) # Load it into the web view element




    def populateLicensePage(self):
        
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.elain')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareComboBox(
                databaseOperation1, self.licenseAnimalCB, 0, 0)

        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.aikuinenvasa')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
        else:
            prepareData.prepareComboBox(
                databaseOperation2, self.licenseAgeGroupCB, 0, 0)
        
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.sukupuoli')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
                )
        else:
            prepareData.prepareComboBox(
                databaseOperation3, self.licenseGenderCB, 0, 0)
        
        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.lupa')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
                )
        else:
            prepareData.prepareTable(databaseOperation4, self.licenseSummaryTW)
            self.licenseSummaryTW.setColumnHidden(0, True)
            self.licenseSummaryTW.setColumnHidden(1, True)

    
    def populateMaintenancePage(self):
        pass
        



    def populateAllPages(self):

        self.populateSummaryPage()
        self.populateKillPage()
        self.populateSharePage()
        self.populateLicensePage()
        self.populateMaintenancePage()

    def populatePage(self):
        index = self.pageTab.currentIndex()
        match index:
            case 0:
                self.populateSummaryPage()
            case 1:
                self.populateKillPage()
            case 2:
                self.populateSharePage()
            case 3:
                self.populateLicensePage()
            case 4:
                self.populateMaintenancePage()


    def saveShot(self):
        try:
            shotByChosenItemIx = self.shotByCB.currentIndex() # Row index of the selected row
            shotById = self.shotByIdList[shotByChosenItemIx] # Id value of the selected row
            shootingDay = self.shotDateDE.date().toPyDate() # Python date is in ISO format
            shootingPlace = self.shotLocationLE.text() # Text value of line edit
            animal = self.shotAnimalCB.currentText() # Selected value of the combo box 
            ageGroup = self.shotAgeGroupCB.currentText() # Selected value of the combo box
            gender = self.shotGenderCB.currentText() # Selected value of the combo box
            weight = float(self.shotWeightLE.text()) # Convert line edit value into float (real in the DB)
            useIx = self.shotUsageCB.currentIndex() # Row index of the selected row
            use = self.shotUsageIdList[useIx] # Id value of the selected row
            additionalInfo = self.shotAddInfoTE.toPlainText() # Convert multiline text edit into plain text

            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.kaato(jasen_id, kaatopaiva, ruhopaino, paikka_teksti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES("
            sqlClauseValues = f"{shotById}, '{shootingDay}', {weight}, '{shootingPlace}', {use}, '{animal}', '{gender}', '{ageGroup}', '{additionalInfo}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            # print(sqlClause) # FIXME: Remove this line in pruduction
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
            self.populateKillPage()
            self.shotLocationLE.clear()
            self.shotWeightLE.clear()
            self.shotAddInfoTE.clear()

    # TODO: Test saveShare button functionality
    def saveShare(self):
        # FIXME: Id values are not correctly managed
        try:
            # shareKillChosenRowIx = self.shareKillsTW.currentRow()
            # shareKill = int(self.shareKillsTW.itemAt(shareKillChosenRowIx, 0).text()) # FIXME: Check if row and column are correctly placed
            shareKillId = int(self.shareKillId)
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = float(self.shareAmountLE.text())
            shareGroupChosenItemIx = self.shareGroupCB.currentIndex()
            shareGroup = self.shareGroupIdList[shareGroupChosenItemIx]
            

            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.jakotapahtuma(paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES("
            sqlClauseValues = f"'{shareDay}', {shareGroup}, '{portion}', {weight}, {shareKillId}"
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
            self.populateSharePage()
            self.shareAmountLE.clear()

    def saveLicense(self):
        try:
            seuraId = 1
            licenceYear = self.licenseYearLE.text()
            licenseAnimal = self.licenseAnimalCB.currentText()
            licenseGender = self.licenseGenderCB.currentText()
            licenseAgeGroup = self.licenseAgeGroupCB.currentText()
            licenseAmount = int(self.licenseAmountLE.text())

            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.lupa(seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES("
            sqlClauseValues = f"{seuraId}, '{licenceYear}', '{licenseAnimal}', '{licenseGender}', '{licenseAgeGroup}', {licenseAmount}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            # print(sqlClause) # FIXME: Remove this line in pruduction
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
            self.populateLicensePage()
            self.licenseYearLE.clear()
            self.licenseAmountLE.clear()

    def onShareKillTableClick(self, item):
        selectedRow = item.row()
        self.shareKillId = self.shareKillsTW.item(selectedRow, 0).text()
        
    def openSettingsDialog(self):
        dialog = DialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

    def openManualDialog(self):
        dialog = DialogueWindow.ManualDialog()
        dialog.exec()

    def openSuggestionDialog(self):
        dialog = SuggestionDialog.Suggestion()
        dialog.exec()
    
    def openAddMemberDialog(self):
        dialog = AddDialogueWindow.Member()
        dialog.exec()
    
    def openRemoveMemberDialog(self):
        dialog = RemoveDialogueWindow.Member()
        dialog.exec()
    
    def openAddMembershipDialog(self):
        dialog = AddDialogueWindow.Membership()
        dialog.exec()
    
    def openAddGroupDialog(self):
        dialog = AddDialogueWindow.Group()
        dialog.exec()

    def openRemoveGroupDialog(self):
        dialog = RemoveDialogueWindow.Group()
        dialog.exec()

    def openAddMPartyDialog(self):
        dialog = AddDialogueWindow.Party()
        dialog.exec()
    
    def openRemovePartyDialog(self):
        dialog = RemoveDialogueWindow.Party()
        dialog.exec()
    
    def openEditCompanyDialog(self):
        dialog = EditDialogueWindow.Company()
        dialog.exec()

    def openEditMemberDialog(self):
        dialog = EditDialogueWindow.Member()
        dialog.exec()

    def openEditMembershipDialog(self):
        dialog = EditDialogueWindow.Membership()
        dialog.exec()
    
    def openEditGroupDialog(self):
        dialog = EditDialogueWindow.Group()
        dialog.exec()

    def openEditPartyDialog(self):
        dialog = EditDialogueWindow.Party()
        dialog.exec()

# APPLICATION CREATION AND STARTING
# ----------------------------------


# Check if app will be created and started directly from this file
if __name__ == "__main__":

    # Create an application object
    app = QApplication(sys.argv)
    app.setStyle('Fusion')

    # Create the Main Window object from MultiPageMainWindowe Class and show it on the screen
    appWindow = MultiPageMainWindow()
    appWindow.show()  # This can also be included in the MultiPageMainWindow class
    sys.exit(app.exec_())
