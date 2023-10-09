
from PyQt5.QtWidgets import QWidget, QScrollArea, QMessageBox, QComboBox, QTableWidget, QPushButton, QLineEdit
from PyQt5.uic import loadUi
import pgModule
import prepareData


import dialogs.dialogueWindow as dialogueWindow


class Ui_licenseTabWidget(QScrollArea, QWidget):
    def __init__(self):
        super(Ui_licenseTabWidget, self).__init__()
        loadUi('ui/licenseTab.ui', self)

        self.licenseYearLE: QLineEdit = self.licenseYearLineEdit
        self.licenseAnimalCB: QComboBox = self.licenseAnimalComboBox
        self.licenseAgeGroupCB: QComboBox = self.licenseAgeGroupComboBox
        self.licenseGenderCB: QComboBox = self.licenseGenderComboBox
        self.licenseAmountLE: QLineEdit = self.licenseAmountLineEdit
        self.licenseSavePushBtn: QPushButton = self.licenseSavePushButton
        self.licenseSavePushBtn.clicked.connect(self.saveLicense) # Signal
        self.licenseSummaryTW: QTableWidget = self.licenseSummaryTableWidget

        self.licenseSortCB: QComboBox = self.licenseSortComboBox

            # Read database connection arguments from the settings file
        try:
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')
        except:
            self.openSettingsDialog()
            databaseOperation = pgModule.DatabaseOperation()
            self.connectionArguments = databaseOperation.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.populateLicensePage()

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
            databaseOperation4.columnHeaders = [ "LupaID", "SeuraID", "Lupavuosi", "Eläin", "Sukupuoli", "Ikäluokka", "Lupamäärä"]
            prepareData.prepareTable(databaseOperation4, self.licenseSummaryTW)
            self.licenseSummaryTW.setColumnHidden(0, True)
            self.licenseSummaryTW.setColumnHidden(1, True)

        # Populate the sort combobox
        sortOptions = [
            'Lupavuosi \u2193',
            'Lupavuosi \u2191',
            'Eläin \u2193',
            'Eläin \u2191',
            'Sukupuoli \u2193',
            'Sukupuoli \u2191',
            'Ikäluokka \u2193',
            'Ikäluokka \u2191',
            'Lupamäärä \u2193',
            'Lupamäärä \u2191'
        ]
        self.licenseSortCB.clear()
        self.licenseSortCB.addItems(sortOptions)

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

    #SIGNALS
    def openSettingsDialog(self):
        dialog = dialogueWindow.SaveDBSettingsDialog()
        dialog.exec()