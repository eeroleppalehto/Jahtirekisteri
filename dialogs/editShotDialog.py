
# LIBRARIES AND MODULES
# ---------------------
import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

class EditShot(DialogFrame):
    """docstring for ClassName."""
    def __init__(self):
        super().__init__()

        loadUi('ui/editShotDialog.ui', self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa kaatoja')

        # Elements
        self.editShotTW = self.editShotTableWidget
        self.editShotTW.itemClicked.connect(self.onTableItemClicked)
        self.editShotPopulatePB = self.editShotPopulatePushButton
        self.editShotPopulatePB.clicked.connect(self.populateFields)
        self.editShotByCB = self.editShotByComboBox
        self.editShotAnimalCB = self.editShotAnimalComboBox
        self.editShotDE = self.editShotDateEdit
        self.editShotLocationLE = self.editShotLocationLineEdit
        self.editShotGenderCB = self.editShotGenderComboBox
        self.editShotAgeCB = self.editShotAgeComboBox
        self.editShotWeightLE = self.editShotWeightLineEdit
        self.editShotUsageCB = self.editShotUsageComboBox
        self.editShotAdditionalnfoPT = self.editShotAdditionalInfoPlainTextEdit

        self.editShotSavePB = self.editShotSavePushButton
        self.editShotSavePB.clicked.connect(self.editShot)
        self.editShotCancelPB = self.editShotCancelPushButton

        self.state = 0

        self.populateEditShotDialog()

        
    def populateEditShotDialog(self):
        
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.kaatoluettelo_indeksilla')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
            )
        else:
            prepareData.prepareTable(databaseOperation1, self.editShotTW)
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.nimivalinta')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
            )
        else:
            self.shotByIdList = prepareData.prepareComboBox(databaseOperation2, self.editShotByCB, 1, 0)
        
        databaseOperation3 = pgModule.DatabaseOperation()
        databaseOperation3.getAllRowsFromTable(
            self.connectionArguments, 'public.elain')
        if databaseOperation3.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation3.errorMessage,
                databaseOperation3.detailedMessage
            )
        else:
            self.shotAnimalText = prepareData.prepareComboBox(databaseOperation3, self.editShotAnimalCB, 0, 0)

        databaseOperation4 = pgModule.DatabaseOperation()
        databaseOperation4.getAllRowsFromTable(
            self.connectionArguments, 'public.aikuinenvasa')
        if databaseOperation4.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation4.errorMessage,
                databaseOperation4.detailedMessage
            )
        else:
            self.shotAgeGroupText = prepareData.prepareComboBox(databaseOperation4, self.editShotAgeCB, 0, 0)
        
        databaseOperation5 = pgModule.DatabaseOperation()
        databaseOperation5.getAllRowsFromTable(
            self.connectionArguments, 'public.sukupuoli')
        if databaseOperation5.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation5.errorMessage,
                databaseOperation5.detailedMessage
            )
        else:
            self.shotGenderText = prepareData.prepareComboBox(databaseOperation5, self.editShotGenderCB, 0, 0)
        
        databaseOperation6 = pgModule.DatabaseOperation()
        databaseOperation6.getAllRowsFromTable(
            self.connectionArguments, 'public.kasittely')
        if databaseOperation6.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation6.errorMessage,
                databaseOperation6.detailedMessage
            )
        else:
            self.shotUsageIdList = prepareData.prepareComboBox(databaseOperation6, self.editShotUsageCB, 1, 0)
        
    def populateFields(self):
        memberIx = self.editShotByCB.findText(self.shooter, Qt.MatchFixedString)
        if memberIx >= 0:
            self.editShotByCB.setCurrentIndex(memberIx)
        else:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse kaataja',
                ''
            )
        
        animalIx = self.editShotAnimalCB.findText(self.shotAnimal, Qt.MatchFixedString)
        if animalIx >= 0:
            self.editShotAnimalCB.setCurrentIndex(animalIx)
        else:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse eläin',
                ''
            )
        
        ageIx = self.editShotAgeCB.findText(self.shotAge, Qt.MatchFixedString)
        if ageIx >= 0:
            self.editShotAgeCB.setCurrentIndex(ageIx)
        else:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse ikäryhmä',
                ''
            )
        
        shotDate = QDate.fromString(self.shotDate, 'yyyy-MM-dd')
        self.editShotDE.setDate(shotDate)

        self.editShotLocationLE.setText(self.shotLocation)
        
        genderIx = self.editShotGenderCB.findText(self.shotGender, Qt.MatchFixedString)
        if genderIx >= 0:
            self.editShotGenderCB.setCurrentIndex(genderIx)
        else:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse sukupuoli',
                ''
            )
        
        self.editShotWeightLE.setText(str(self.shotWeight))

        usageIx = self.editShotUsageCB.findText(self.shotUsage, Qt.MatchFixedString)
        if usageIx >= 0:
            self.editShotUsageCB.setCurrentIndex(usageIx)
        else:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse käsittely',
                ''
            )
        

        # TODO: Add ability to edit additional info
        self.editShotAdditionalnfoPT.setPlainText(self.shotInfo)




    def editShot(self):
        errorCode = 0
        if self.state == -1:
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse muokattava kaato',
                ''
            )
            return
        try:
            shotByChosenItemIx = self.editShotByCB.currentIndex()
            shotById = self.shotByIdList[shotByChosenItemIx]

            useIx = self.editShotUsageCB.currentIndex()
            use = self.shotUsageIdList[useIx]

            updateList = [
                shotById,
                str(self.editShotDE.date().toPyDate()),
                float(self.editShotWeightLE.text()),
                self.editShotLocationLE.text(),
                use,
                self.editShotAnimalCB.currentText(),
                self.editShotGenderCB.currentText(),
                self.editShotAgeCB.currentText(),
                self.editShotAdditionalnfoPT.toPlainText(),
            ]
            print(updateList)

            columnNames = [
                'jasen_id',
                'kaatopaiva',
                'ruhopaino',
                'paikka_teksti',
                'kasittelyid',
                'elaimen_nimi',
                'sukupuoli',
                'ikaluokka',
                'lisatieto'
            ]

            columnValueString = ''
            for i in range(len(columnNames)):
                columnValueString += f"{columnNames[i]} = {updateList[i]!r}"
                if i != len(columnNames) - 1:
                    columnValueString += ', '
        
            
           
            table = 'public.kaato'
            limit = f"public.kaato.kaato_id = {self.shotId}"
        except:
            self.alert(
                'Virhe',
                'Virhe',
                'Tarkista syöte',
                ''
            )
        
        print(self.compareUpdates(updateList))
        print(table, columnValueString, limit)
        if self.compareUpdates(updateList) == False:
            databaseOperation = pgModule.DatabaseOperation()
            databaseOperation.updateManyValuesInRow(
                self.connectionArguments, table, columnValueString, limit)
            if databaseOperation.errorCode != 0:
                self.alert(
                    'Vakava virhe',
                    'Tietokantavirhe',
                    databaseOperation.errorMessage,
                    databaseOperation.detailedMessage
                )
        # TODO: Remove prints and add error handling
    

    def onTableItemClicked(self, item):
        selectedRow = item.row()
        self.shooterId = self.editShotTW.item(selectedRow, 0).text()
        self.shooter = self.editShotTW.item(selectedRow, 1).text()
        self.shotDate = self.editShotTW.item(selectedRow, 2).text()
        self.shotLocation = self.editShotTW.item(selectedRow, 3).text()
        self.shotAnimal = self.editShotTW.item(selectedRow, 4).text()
        self.shotAge = self.editShotTW.item(selectedRow, 5).text()
        self.shotGender = self.editShotTW.item(selectedRow, 6).text()
        self.shotUsageId = self.editShotTW.item(selectedRow, 7).text()
        self.shotUsage = self.editShotTW.item(selectedRow, 8).text()
        self.shotWeight = self.editShotTW.item(selectedRow, 9).text()
        self.shotInfo = self.editShotTW.item(selectedRow, 10).text()
        self.shotId = int(self.editShotTW.item(selectedRow, 11).text())

        originalList = [
            self.shooterId,
            self.shotDate,
            self.shotWeight,
            self.shotLocation,
            self.shotAnimal,
            self.shotAge,
            self.shotGender,
            self.shotUsageId,
            self.shotInfo
        ]

        print(originalList)


    def compareUpdates(self, updateList):
        originalList = [
            int(self.shooterId),
            str(date.fromisoformat(self.shotDate)),
            float(self.shotWeight),
            self.shotLocation,
            self.shotAnimal,
            self.shotAge,
            self.shotGender,
            int(self.shotUsageId),
            self.shotInfo
        ]
        
        for i in range(len(updateList)):
            if updateList[i] != originalList[i]:
                return False
        return True


class TestMainWindow(QMainWindow):
    """Main Window for testing dialogs."""

    def __init__(self):
        super().__init__()

        self.setWindowTitle('Pääikkuna dialogien testaukseen')

        # Add dialogs to be tested here and run them as follows:
        saveDBSettingsDialog = EditShot()
        saveDBSettingsDialog.exec()

# Some tests
if __name__ == "__main__":

    # Create a testing application
    testApp = QApplication(sys.argv)

    # Create a main window for testing a dialog
    testMainWindow = TestMainWindow()
    testMainWindow.show()

    # Run the testing application
    testApp.exec()
    