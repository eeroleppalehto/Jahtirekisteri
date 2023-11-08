import sys
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QPushButton,
                             QComboBox, QTableWidget, QLineEdit,
                             QTableWidgetItem)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import prepareData as prepareData

from dialogs.messageModule import PopupMessages as msg


class License(DialogFrame):
    def __init__(self):
        super().__init__()

        loadUi('ui/editLicenseDialog.ui', self)
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa lupia')

        self.licenseTW: QTableWidget = self.licenseTableWidget
        self.licenseTW.itemClicked.connect(self.onTableClick)

        self.populateFromTablePB: QPushButton = self.populateFromTablePushButton
        self.populateFromTablePB.clicked.connect(self.populateFields)
        self.licenseYearLE: QLineEdit = self.licenseYearLineEdit
        self.animalCB: QComboBox = self.animalComboBox
        self.animalGenderCB: QComboBox = self.animalGenderComboBox
        self.animalAgeGroupCB: QComboBox = self.animalAgeGroupComboBox
        self.licenseAmountLE: QLineEdit = self.licenseAmountLineEdit

        self.savePB: QPushButton = self.savePushButton
        self.savePB.clicked.connect(self.saveEdit)
        self.cancelPB: QPushButton = self.cancelPushButton
        self.cancelPB.clicked.connect(self.closeDialog)


        self.savePB.setEnabled(False)
        self.populateFromTablePB.setEnabled(False)
        self.populateEditLicenseDialog()

    def populateEditLicenseDialog(self):
        # TableWidget
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(self.connectionArguments, 'public.lupa')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorCode,
                databaseOperation.detailedMessage
            )
        else:
            prepareData.prepareTable(databaseOperation, self.licenseTW)
        # AnimalComboBox
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(self.connectionArguments, 'public.elain')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorCode,
                databaseOperation1.detailedMessage
            )
        else:
            self.animalIdList = prepareData.prepareComboBox(databaseOperation1, self.animalCB, 0, 0)
        # AnimalGenderComboBox
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(self.connectionArguments, 'public.sukupuoli')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorCode,
                databaseOperation2.detailedMessage
            )
        else:
            self.genderIdList = prepareData.prepareComboBox(databaseOperation2, self.animalGenderCB, 0, 0)
        # AnimalAgeGroupComboBox
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(self.connectionArguments, 'public.aikuinenvasa')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation3.errorCode,
                databaseOperation3.detailedMessage
            )
        else:
            self.ageGroupIdList = prepareData.prepareComboBox(databaseOperation3, self.animalAgeGroupCB, 0, 0)

    def onTableClick(self, item: QTableWidgetItem):
        
        selectedRow = item.row()
        self.itemToPopulate = {
            "luparivi_id": int(self.licenseTW.item(selectedRow, 0).text()),
            "seura_id": int(self.licenseTW.item(selectedRow, 1).text()),
            "lupavuosi": self.licenseTW.item(selectedRow, 2).text(),
            "elaimen_nimi": self.licenseTW.item(selectedRow, 3).text(),
            "sukupuoli": self.licenseTW.item(selectedRow, 4).text(),
            "ikaluokka": self.licenseTW.item(selectedRow, 5).text(),
            "maara": self.licenseTW.item(selectedRow, 6).text()
        }
        self.populateFromTablePB.setEnabled(True)

    def populateFields(self):

        try:
            self.licenseYearLE.setText(self.itemToPopulate["lupavuosi"])
            self.animalCB.setCurrentIndex(self.animalIdList.index(self.itemToPopulate["elaimen_nimi"]))
            self.animalGenderCB.setCurrentIndex(self.genderIdList.index(self.itemToPopulate["sukupuoli"]))
            self.animalAgeGroupCB.setCurrentIndex(self.ageGroupIdList.index(self.itemToPopulate["ikaluokka"]))
            self.licenseAmountLE.setText(self.itemToPopulate["maara"])

            self.savePB.setEnabled(True)

        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Kenttien täyttö epäonnistui',
                str(e),
                str(e)
            )
            
    def saveEdit(self):
        
        try:
            self.licenseId = self.itemToPopulate["luparivi_id"]
            self.companyId = self.itemToPopulate["seura_id"]
            self.editToSave = {
                "lupavuosi": self.licenseYearLE.text(),
                "elaimen_nimi": self.animalIdList[self.animalCB.currentIndex()],
                "sukupuoli": self.genderIdList[self.animalGenderCB.currentIndex()],
                "ikaluokka": self.ageGroupIdList[self.animalAgeGroupCB.currentIndex()],
                "maara": int(self.licenseAmountLE.text())
            }

            columnValueString = ""
            for value in self.editToSave:
                columnValueString += f"{value} = {self.editToSave[value]!r}"
                if value != "maara":
                    columnValueString += ", "
            limit = f"public.lupa.luparivi_id = {self.licenseId} AND public.lupa.seura_id = {self.companyId}"

        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                str(e),
                str(e)
            )

        editsMade = self.compareEdit()
        if not editsMade:
            msg().warningMessage('Muutoksia ei ole tehty')
            return
        
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.updateManyValuesInRow(self.connectionArguments, 'public.lupa', columnValueString, limit)
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorCode,
                databaseOperation.detailedMessage
            )
        else:
            msg().successMessage('Muokkaus onnistui')
            self.licenseYearLE.clear()
            self.licenseAmountLE.clear()
            self.savePB.setEnabled(False)
            self.populateEditLicenseDialog()

    def compareEdit(self):
        
        if (self.editToSave["lupavuosi"] == self.itemToPopulate["lupavuosi"]
            and self.editToSave["elaimen_nimi"] == self.itemToPopulate["elaimen_nimi"]
            and self.editToSave["sukupuoli"] == self.itemToPopulate["sukupuoli"]
            and self.editToSave["ikaluokka"] == self.itemToPopulate["ikaluokka"]
            and str(self.editToSave["maara"]) == str(self.itemToPopulate["maara"])):
            return False
        else:
            return True


    def closeDialog(self):
        self.close()
