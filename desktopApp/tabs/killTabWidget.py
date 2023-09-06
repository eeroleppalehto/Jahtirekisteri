
from PyQt5.QtWidgets import QWidget, QScrollArea, QMessageBox
from PyQt5.uic import loadUi
from datetime import date
import pgModule
import prepareData

import dialogs.dialogueWindow as dialogueWindow
import dialogs.editShotDialog as editShotDialog


class Ui_killTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_killTabWidget, self).__init__()
        loadUi('ui/killTab.ui', self)
        
        self.currentDate = date.today()
        
        self.shotByCB = self.shotByComboBox
        self.shotDateDE = self.shotDateEdit
        self.shotLocationLE = self.locationLineEdit
        self.shotAnimalCB = self.animalComboBox
        self.shotAgeGroupCB = self.ageGroupComboBox
        self.shotGenderCB = self.genderComboBox
        self.shotWeightLE = self.weightLineEdit
        self.shotAddInfoTE = self.additionalInfoTextEdit
        self.shotSavePushBtn = self.saveShotPushButton
        self.shotSavePushBtn.clicked.connect(self.saveShotAndUsage) # Signal
        self.shotKillsTW = self.killsKillsTableWidget
        self.shotLicenseTW = self.shotLicenseTableWidget

        self.shotUsageCB = self.usageComboBox
        self.shotUsagePortionSB = self.usagePortionSpinBox
        self.shotUsagePortionSB.valueChanged.connect(self.calculateUsage2Value) # Signal

        self.shotUsage2CheckB = self.usage2CheckBox
        self.shotUsage2CheckB.stateChanged.connect(self.toggleUsage2) # Signal

        self.shotUsage2CB = self.usage2ComboBox
        self.shotUsage2CB.setEnabled(False)

        self.shotUsage2PortionSB = self.usage2PortionSpinBox
        self.shotUsage2PortionSB.setEnabled(False)

        self.editShotsPushBtn = self.editShotsPushButton
        self.editShotsPushBtn.clicked.connect(self.openEditShotDialog) # Signal

        self.shotLicenseYearCB = self.licenseYearComboBox
        #print(f"valinta:'{self.shotLicenseYearCB.currentText()}'")

        # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.shotLicenseYearCB.currentIndexChanged.connect(self.populateShotLicenceTW) # Signal

        self.populateKillPage()

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
            prepareData.prepareComboBox(
                databaseOperation6, self.shotUsage2CB, 1, 0)  

        if self.shotLicenseYearCB.currentText() != '':
            databaseOperation7 = pgModule.DatabaseOperation()
            databaseOperation7.callFunction(
                self.connectionArguments, 'public.get_used_licences', int(self.shotLicenseYearCB.currentText()))
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
        else:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                'Ei löytynyt vuotta, jolta hakea lupatietoja',
                'Could not find year to fetch licence data from, try adding a license in the license page first'
                )
            
        
    def populateLicenceCB(self):
        databaseOperation8 = pgModule.DatabaseOperation()
        databaseOperation8.getAllRowsFromTable(
            self.connectionArguments, 'public.lupa')
        if databaseOperation8.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation8.errorMessage,
                databaseOperation8.detailedMessage
                )
        else:
            self.shotLicenseYearCB.clear() # FIXME: As this is called in populateKillPage, it clears the combo box every time the page is opened which sends a signal that crashes the app
            yearList = [row[2] for row in databaseOperation8.resultSet]
            yearList = list(set(yearList))
            self.shotLicenseYearCB.addItems(yearList)

    def populateShotLicenceTW(self):
        year = int(self.shotLicenseYearCB.currentText())

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.callFunction(
            self.connectionArguments, 'public.get_used_licences', year)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            prepareData.prepareTable(
                databaseOperation, self.shotLicenseTW)

    def saveUsage(self, shotId, usageId, usagePortion):
        """_summary_

        Args:
            shotId (int): _description_
            usageId (int): _description_
            usagePortion (int): _description_
        """
        errorCode = 0
        # FIXME: Is the try-except block necessary?
        try:
            sqlClauseBeginning = "INSERT INTO public.kaadon_kasittely(kaato_id, kasittelyid, kasittely_maara) VALUES("
            sqlClauseValues = f"{shotId!r}, {usageId!r}, {usagePortion!r})"
            sqlClauseEnd = ""
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return
        
        # create DatabaseOperation object to execute the SQL clause

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.insertRowToTable(self.connectionArguments, sqlClause, returnId=False)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )

    def saveShotAndUsage(self):
        shotId = self.saveShot()
        if shotId != None:
            useIx = self.shotUsageCB.currentIndex() # Row index of the selected row
            use = self.shotUsageIdList[useIx] # Id value of the selected row
            usagePortion = self.shotUsagePortionSB.value()

            self.saveUsage(shotId, use, usagePortion)

            if self.shotUsage2CheckB.isChecked():
                use2Ix = self.shotUsage2CB.currentIndex()
                use2 = self.shotUsageIdList[use2Ix]
                usage2Portion = self.shotUsage2PortionSB.value()

                self.saveUsage(shotId, use2, usage2Portion)
        self.populateKillPage()

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
            additionalInfo = self.shotAddInfoTE.toPlainText() # Convert multiline text edit into plain text

            if shootingPlace == '' or self.shotWeightLE.text() == '':
                errorCode = 1
            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlCaluseAdditionalInfo = '' if additionalInfo == '' else f", lisatieto"
            sqlCaluseAdditionalInfoData = '' if additionalInfo == '' else f", '{additionalInfo}'"
            sqlClauseBeginning = f"INSERT INTO public.kaato(jasen_id, kaatopaiva, ruhopaino, paikka_teksti, elaimen_nimi, sukupuoli, ikaluokka{sqlCaluseAdditionalInfo}) VALUES("
            sqlClauseValues = f"{shotById}, '{shootingDay}', {weight}, '{shootingPlace}', '{animal}', '{gender}', '{ageGroup}'{sqlCaluseAdditionalInfoData})"
            sqlClauseEnd = "RETURNING kaato_id;"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
            return
        

        # create DatabaseOperation object to execute the SQL clause
        if errorCode == 1:
            self.alert('Virheellinen syöte', 'Tarvittavat kentät ei ole täytetty', '','Varmista että paikka ja paino kentät on täytetty' )
            return
        
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.insertRowToTable(self.connectionArguments, sqlClause, returnId=True)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            # Update the page to show new data and clear
            self.shotLocationLE.clear()
            self.shotWeightLE.clear()
            self.shotAddInfoTE.clear()
            return databaseOperation.resultId

    def toggleUsage2(self):
        if self.shotUsage2CheckB.isChecked():
            self.shotUsage2CB.setEnabled(True)
            # self.shotUsage2PortionSB.setEnabled(True)
        else:
            self.shotUsage2CB.setEnabled(False)
            # self.shotUsage2PortionSB.setEnabled(False)

    def calculateUsage2Value(self):
        value = self.shotUsagePortionSB.value()
        self.shotUsage2PortionSB.setValue(100 - value)

    #SIGNALS
    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()

    def openEditShotDialog(self):
        dialog = editShotDialog.EditShot()
        dialog.exec()
