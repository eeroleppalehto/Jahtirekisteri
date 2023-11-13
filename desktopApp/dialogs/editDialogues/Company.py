
# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import dialogs.messageModule as msg
import pgModule as pgModule
import prepareData as prepareData

class Company(DialogFrame):
    """Creates a dialog to edit company in database"""
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/editCompanyDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa seuraa')

        # Elements
        self.editCompanyNameLE: QLineEdit = self.editCompanyNameLineEdit
        self.editCompanyPostalAddressLE: QLineEdit = self.editCompanyPostalAddressLineEdit
        self.editCompanyZIPLE: QLineEdit = self.editCompanyZIPLineEdit
        self.editCompanyCityLE: QLineEdit = self.editCompanyCityLineEdit

        self.editCompanySavePushBtn: QPushButton = self.editCompanySavePushButton
        self.editCompanySavePushBtn.clicked.connect(self.editCompany) # Signal
        self.editCompanyCancelPushBtn: QPushButton = self.editCompanyCancelPushButton
        self.editCompanyCancelPushBtn.clicked.connect(self.closeDialog) # Signal

        self.populateEditCompanyDialog()
        
        

    
    def populateEditCompanyDialog(self):

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.seura')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            self.companyInfo = []
            if databaseOperation.resultSet != []:
                self.companyInfo = databaseOperation.resultSet[0]
                self.editCompanyNameLE.setText(self.companyInfo[1])
                self.editCompanyPostalAddressLE.setText(self.companyInfo[2])
                self.editCompanyZIPLE.setText(self.companyInfo[3])
                self.editCompanyCityLE.setText(self.companyInfo[4])


    def editCompany(self):
        errorCode = 0
        # Update option
        if self.companyInfo != []:
            try:
                updateList = (
                    self.editCompanyNameLE.text(),
                    self.editCompanyPostalAddressLE.text(),
                    self.editCompanyZIPLE.text(),
                    self.editCompanyCityLE.text()
                )

                for item in updateList:
                    if item == '':
                        errorCode = 1

                columnList = [
                    'seuran_nimi',
                    'jakeluosoite',
                    'postinumero',
                    'postitoimipaikka'
                ]
                table = 'public.seura'
                limit = 'public.seura.seura_id = 1'

            except:
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Virhe tiedoissa' )
            
            if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi päivittää tyhjää kenttää',
                'Täytä tyhjät kentät päivittääksesi seuran tiedot',
                '-'
                )
                return
            
            i = 0
            j = 1
            for data in updateList:
                if data != self.companyInfo[j]:
                    databaseOperation = pgModule.DatabaseOperation()
                    databaseOperation.updateTable(self.connectionArguments, table,
                    columnList[i], f"{data!r}", limit)
                    if databaseOperation.errorCode != 0:
                        self.alert(
                            'Vakava virhe',
                            'Tietokantaoperaatio epäonnistui',
                            databaseOperation.errorMessage,
                            databaseOperation.detailedMessage
                            )
                i += 1
                j += 1

            msg.PopupMessages().successMessage('Muokkaus onnistui')
            
        # Add option
        else:
            try:
                companyName = self.editCompanyNameLE.text()
                postAddress = self.editCompanyPostalAddressLE.text()
                zipCode = self.editCompanyZIPLE.text()
                city = self.editCompanyCityLE.text()

                companyList = (companyName, postAddress, zipCode, city)
                for item in companyList:
                    if item == '':
                        errorCode = 1
                        break
                

                sqlClauseBeginning = "INSERT INTO public.seura(seuran_nimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
                sqlClauseValues = f"'{companyName}', '{postAddress}', '{zipCode}', '{city}'"
                sqlClauseEnd = ");"
                sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            except:
                self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Seuran muokkaus epäonnistui' )

            if errorCode == 1:
                self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä kaikki kentät lisätäksesi seuran',
                '-'
                )
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
                msg.PopupMessages().successMessage('Muokkaus onnistui')


    def closeDialog(self):
        self.close()
