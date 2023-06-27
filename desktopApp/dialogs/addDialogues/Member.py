import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import QDialog, QLabel, QPushButton, QDateEdit, QSpinBox, QComboBox, QLineEdit
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date


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
        self.addMemberFirstNameLE = self.addMemberFirstNameLineEdit
        self.addMemberLastNameLE = self.addMemberLastNameLineEdit
        self.addMemberPostalAddressLE = self.addMemberPostalAddressLineEdit
        self.addMemberZIPLE = self.addMemberZIPLineEdit
        self.addMemberCityLE = self.addMemberCityLineEdit
        self.addMemberAddPushBtn = self.addMemberAddPushButton
        self.addMemberAddPushBtn.clicked.connect(self.addMember) # Signal
        self.addMemberCancelPushBtn = self.addMemberCancelPushButton
        self.addMemberCancelPushBtn.clicked.connect(self.closeDialog) # Signal
    

    def addMember(self):
        try:
            firstName = self.addMemberFirstNameLE.text()
            lastName = self.addMemberLastNameLE.text()
            postAddress = self.addMemberPostalAddressLE.text()
            zipCode = self.addMemberZIPLE.text()
            city = self.addMemberCityLE.text()

            memberList = (firstName, lastName, postAddress, zipCode, city)

            errorCode = 0
            for item in memberList:
                if item == '':
                    errorCode = 1
                    break

            sqlClauseBeginning = "INSERT INTO public.jasen(etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
            sqlClauseValues = f"'{firstName}', '{lastName}', '{postAddress}', '{zipCode}', '{city}'"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
            
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )

        if errorCode == 1:
            self.alert(
                'Vakava virhe',
                'Et voi lisätä tyhjää kenttää',
                'Täytä kaikki kentät lisätäksesi jäsenen',
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