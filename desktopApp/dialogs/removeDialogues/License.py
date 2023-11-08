import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData
from dialogs.messageModule import PopupMessages as msg


class License(DialogFrame):
    def __init__(self):
        super().__init__()

        loadUi("ui/removeLicenseDialog.ui", self)

        self.setWindowTitle("Poista lupa")
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.licenseCB = self.licenseComboBox
        self.cancelPB = self.cancelPushButton
        self.cancelPB.clicked.connect(self.closeDialog)
        self.removePB = self.removePushButton
        self.removePB.clicked.connect(self.removeLicense)

        self.populateRemoveLicenseDialog()

    def populateRemoveLicenseDialog(self):
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.lupa'
        )
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
            )
        else:
            results = databaseOperation.resultSet
            licenses = []

            for row in results:
                licenses.append((f"{row[3]} | {row[4]} | {row[5]} | Määrä: {row[6]} | {row[2]}", row[0]))
            
            databaseOperation.resultSet = licenses
            self.licenseIdList = prepareData.prepareComboBox(
                databaseOperation, self.licenseCB, 0, 1)

    def removeLicense(self):
        try:
            licenseChosenIx = self.licenseCB.currentIndex()
            licenseId = self.licenseIdList[licenseChosenIx]
            table = 'public.lupa'
            limit = f'public.lupa.luparivi_id = {licenseId}'
        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                'Index virhe',
                str(e)
            )
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, table, limit)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorCode,
                databaseOperation.detailedMessage
            )
        else:
            msg().successMessage('Lupa poistettu')
            self.populateRemoveLicenseDialog()

    def closeDialog(self):
        self.close()