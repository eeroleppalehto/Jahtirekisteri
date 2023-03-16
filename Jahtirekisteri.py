# APPLICATON FOR SHOWING SUMMARY DATA ABOUT MEAT GIVEN TO SHARE GROUP
# ====================================================================

# LIBRARIES AND MODULES
# ---------------------

import sys  # Needed for starting the application
from PyQt5.QtWidgets import (QApplication, QMainWindow, QMessageBox, QWidget, QTabWidget, QTableWidget,
QLabel, QPushButton, QPlainTextEdit, QComboBox, QLineEdit, QDateEdit, QMenuBar, QMenu, QAction, QStatusBar)  # All widgets
from PyQt5 import QtWebEngineWidgets, QtCore # For showing html content
from PyQt5.uic import loadUi
from PyQt5.QtCore import * # FIXME: Everything,  change to individual components
from datetime import date
import pgModule
import prepareData
import dialogs.dialogueWindow as dialogueWindow
import dialogs.addDialogueWindow as addDialogueWindow
import dialogs.removeDialogueWindow as removeDialogueWindow
import dialogs.editDialogueWindow as editDialogueWindow
import figures
import party

# CLASS DEFINITIONS FOR THE APP
# -----------------------------


class MultiPageMainWindow(QMainWindow):

    # Constructor, a method for creating objects from this class
    def __init__(self):
        QMainWindow.__init__(self)

        # Create an UI from the ui file
        loadUi('ui/MultiPageMainWindow.ui', self)

        # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
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
        self.shotLicenseTW = self.shotLicenseTableWidget

        # Share page (Lihanjako)
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
        self.actionInfo.triggered.connect(self.openInfoDialog)

        # Signals other than emitted by UI elements
        self.populateAllPages()

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
            for party in partyData:
                newParty = party.Party(party[0], party[1], party[2], party[3])
                newParty.getGroups(groupList)
                partySankeyData += newParty.getSankeyData()
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
            
        databaseOperation7 = pgModule.DatabaseOperation()
        databaseOperation7.getAllRowsFromTable(
            self.connectionArguments, 'public.luvat_kayttamatta_kpl_pros')
        if databaseOperation7.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation7.errorMessage,
                databaseOperation7.detailedMessage
                )
        else:
            prepareData.prepareTable(
                databaseOperation7, self.shotLicenseTW)

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
            for party in partyData:
                newParty = party.Party(party[0], party[1], party[2], party[3])
                newParty.getGroups(groupList)
                partySankeyData += newParty.getSankeyData()
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
                    for row in sharedPortionsData:
                        if row[0] == id:
                            animal = row[1]
                            sharedPortions += portionDict[row[2]]
                            amount += row[3]
                    sharedPortions = f"{sharedPortions}/4"
                    newData.append((id, animal, sharedPortions, amount))
                
                # Replace resultSet with new data
                databaseOperation6.resultSet = newData
                prepareData.prepareTable(databaseOperation6, self.sharedPortionsTW)
            except Exception as e:
                self.alert(
                'Vakava virhe',
                'Jaetut taulukon luonti epäonnistui',
                'Shared kills failed to load on share page',
                'Oops'
            )

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
        # match index:
        #     case 0:
        #         self.populateSummaryPage()
        #     case 1:
        #         self.populateKillPage()
        #     case 2:
        #         self.populateSharePage()
        #     case 3:
        #         self.populateLicensePage()
        #     case 4:
        #         self.populateMaintenancePage()

        if index == 0:
            self.populateSummaryPage()
        elif index == 1:
            self.populateKillPage()
        elif index == 2:
            self.populateSharePage()
        elif index == 3:
            self.populateLicensePage()
        elif index == 4:
            self.populateMaintenancePage()


    def saveShot(self):
        errorCode = 0
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

            if shootingPlace == '' or self.shotWeightLE.text() == '':
                errorCode = 1
            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.kaato(jasen_id, kaatopaiva, ruhopaino, paikka_teksti, kasittelyid, elaimen_nimi, sukupuoli, ikaluokka, lisatieto) VALUES("
            sqlClauseValues = f"{shotById}, '{shootingDay}', {weight}, '{shootingPlace}', {use}, '{animal}', '{gender}', '{ageGroup}', '{additionalInfo}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            # print(sqlClause) # FIXME: Remove this line in pruduction
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return
        

        # create DatabaseOperation object to execute the SQL clause
        if errorCode == 1:
            self.alert('Virheellinen syöte', 'Tarvittavat kentät ei ole täytetty', '','Varmista että paikka ja paino kentät on täytetty' )
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
            self.populateKillPage()
            self.shotLocationLE.clear()
            self.shotWeightLE.clear()
            self.shotAddInfoTE.clear()

    # TODO: Test saveShare button functionality
    def saveShare(self):
        errorCode = 0
        try:
            shareKillId = int(self.shareKillId)
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = float(self.shareAmountLE.text())
            shareGroupChosenItemIx = self.shareGroupCB.currentIndex()
            shareGroup = self.shareGroupIdList[shareGroupChosenItemIx]
            
            if self.shareKillId == '':
                errorCode = 1
            
            if self.shareAmountLE.text() == '':
                errorCode = 2
            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.jakotapahtuma(paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES("
            sqlClauseValues = f"'{shareDay}', {shareGroup}, '{portion}', {weight}, {shareKillId}"
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

    def saveLicense(self):
        errorCode = 0
        try:
            seuraId = 1
            licenceYear = self.licenseYearLE.text()
            licenseAnimal = self.licenseAnimalCB.currentText()
            licenseGender = self.licenseGenderCB.currentText()
            licenseAgeGroup = self.licenseAgeGroupCB.currentText()
            licenseAmount = int(self.licenseAmountLE.text())

            if licenceYear == '' or self.licenseAmountLE.text() == '':
                errorCode = 1

            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.lupa(seura_id, lupavuosi, elaimen_nimi, sukupuoli, ikaluokka, maara) VALUES("
            sqlClauseValues = f"{seuraId}, '{licenceYear}', '{licenseAnimal}', '{licenseGender}', '{licenseAgeGroup}', {licenseAmount}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return
        

        if errorCode == 1:
            self.alert('Virheellinen syöte', 'Tarvittavat kentät ei ole täytetty', '','Täytä Lupavuosi ja Määrä kentät' )
            return

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
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

    def openManualDialog(self):
        dialog = dialogueWindow.ManualDialog()
        dialog.exec()

    def openInfoDialog(self):
        dialog = dialogueWindow.InfoDialog()
        dialog.exec()
    
    def openAddMemberDialog(self):
        dialog = addDialogueWindow.Member()
        dialog.exec()
    
    def openRemoveMemberDialog(self):
        dialog = removeDialogueWindow.Member()
        dialog.exec()
    
    def openAddMembershipDialog(self):
        dialog = addDialogueWindow.Membership()
        dialog.exec()
    
    def openAddGroupDialog(self):
        dialog = addDialogueWindow.Group()
        dialog.exec()

    def openRemoveGroupDialog(self):
        dialog = removeDialogueWindow.Group()
        dialog.exec()

    def openAddMPartyDialog(self):
        dialog = addDialogueWindow.Party()
        dialog.exec()
    
    def openRemovePartyDialog(self):
        dialog = removeDialogueWindow.Party()
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
