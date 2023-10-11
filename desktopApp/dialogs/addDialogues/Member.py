import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QLabel, QPushButton, QDateEdit, QSpinBox, QComboBox, QLineEdit
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData


class Member(DialogFrame):
    """Creates a dialog to add member to database"""
    
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/addMemberDialog.ui", self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Lisää jäsen')

        # Elements
        self.addMemberFirstNameLE: QLineEdit = self.addMemberFirstNameLineEdit
        self.addMemberLastNameLE: QLineEdit = self.addMemberLastNameLineEdit
        self.addMemberPostalAddressLE: QLineEdit = self.addMemberPostalAddressLineEdit
        self.addMemberZIPLE: QLineEdit = self.addMemberZIPLineEdit
        self.addMemberCityLE: QLineEdit = self.addMemberCityLineEdit
        self.addMemberPhoneNumberLE: QLineEdit = self.addMemberPhoneNumberLineEdit
        self.addMemberAddPushBtn: QPushButton = self.addMemberAddPushButton
        self.addMemberAddPushBtn.clicked.connect(self.addMember) # Signal
        self.addMemberCancelPushBtn: QPushButton = self.addMemberCancelPushButton
        self.addMemberCancelPushBtn.clicked.connect(self.closeDialog) # Signal
    

    def addMember(self):
        try:
            firstName = self.addMemberFirstNameLE.text().strip()
            lastName = self.addMemberLastNameLE.text().strip()
            postAddress = self.addMemberPostalAddressLE.text().strip()
            zipCode = self.addMemberZIPLE.text().strip()
            city = self.addMemberCityLE.text().strip()
            phoneNumber = self.addMemberPhoneNumberLE.text().strip()

            nameList = (firstName, lastName)
            
            optionalFields = (postAddress, zipCode, city, phoneNumber)

            # Check if any of the required fields are empty
            # If empty, set error code to 1
            # to immediately stop the execution
            errorCode = 0
            for item in nameList:
                if item == '':
                    errorCode = 1
                    break

            sqlClauseBeginning = "INSERT INTO public.jasen(etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, puhelinnumero) VALUES("

            sqlClauseValues = f"'{firstName}', '{lastName}'"            
            for field in optionalFields:
                if field != '':
                    sqlClauseValues += f", '{field}'"
                else:
                    sqlClauseValues += ", NULL"
            
            
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        # If any of the required fields were empty, show an error message
        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä kaikki kentät lisätäksesi uuden jäsenen',
                '-'
                )
        else:
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
                success = SuccessfulOperationDialog()
                success.exec()
                self.addMemberFirstNameLE.clear()
                self.addMemberLastNameLE.clear()
                self.addMemberPostalAddressLE.clear()
                self.addMemberZIPLE.clear()
                self.addMemberCityLE.clear()


    def closeDialog(self):
        self.close()