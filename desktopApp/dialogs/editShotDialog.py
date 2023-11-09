
# LIBRARIES AND MODULES
# ---------------------
import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QDialog, QLineEdit, QLabel, QPushButton,
                             QComboBox, QTableWidget, QSpinBox, QDateEdit, QCheckBox,
                             QMainWindow, QApplication, QPlainTextEdit)
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
from datetime import date

from dialogs.messageModule import PopupMessages as msg

class EditShot(DialogFrame):
    """docstring for ClassName."""
    def __init__(self):
        super().__init__()

        loadUi('ui/editShotDialog.ui', self)

        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Muokkaa kaatoja')

        # Elements
        self.editShotTW: QTableWidget = self.editShotTableWidget
        self.editShotTW.itemClicked.connect(self.onTableItemClicked)
        self.editShotPopulatePB: QPushButton = self.editShotPopulatePushButton
        self.editShotPopulatePB.clicked.connect(self.populateFields)
        self.editShotPopulatePB.setEnabled(False)

        self.editShotByCB: QComboBox = self.editShotByComboBox
        self.editShotAnimalCB: QComboBox = self.editShotAnimalComboBox
        self.editShotDE: QDateEdit = self.editShotDateEdit
        self.editShotLocationLE: QLineEdit = self.editShotLocationLineEdit
        self.editShotLocationLE.textChanged.connect(self.validateLineEdits)
        self.editShotGenderCB: QComboBox = self.editShotGenderComboBox
        self.editShotAgeCB: QComboBox = self.editShotAgeComboBox
        self.editShotWeightLE: QLineEdit = self.editShotWeightLineEdit
        self.editShotWeightLE.textChanged.connect(self.validateLineEdits)
        self.editShotAdditionalInfoPT: QPlainTextEdit = self.editShotAdditionalInfoPlainTextEdit
        
        self.editShotUsageCB: QComboBox = self.editShotUsageComboBox
        self.editShotUsageSB: QSpinBox = self.editShotUsagePortionSpinBox
        self.editShotUsageSB.valueChanged.connect(self.calculateUsage2Value)

        self.editShotUsage2CB: QComboBox = self.editShotUsage2ComboBox
        self.editShotUsage2CB.setEnabled(False)

        self.editShotUsage2SB: QSpinBox = self.editShotUsage2PortionSpinBox
        self.editShotUsage2SB.setEnabled(False)
        

        self.editShotUsage2CheckB: QCheckBox = self.editShotUsage2CheckBox
        self.editShotUsage2CheckB.clicked.connect(self.toggleUsage2)

        self.editShotSavePB: QPushButton = self.editShotSavePushButton
        self.editShotSavePB.setEnabled(False)
        self.editShotSavePB.clicked.connect(self.editShotAndUsage)
        self.editShotCancelPB: QPushButton = self.editShotCancelPushButton
        self.editShotCancelPB.clicked.connect(self.closeDialog)

        self.state = -1

        self.populateEditShotDialog()


    def toggleUsage2(self):
        if self.editShotUsage2CheckB.isChecked():
            self.editShotUsage2CB.setEnabled(True)
        else:
            self.editShotUsage2CB.setEnabled(False)
    
    def calculateUsage2Value(self):
        self.editShotUsage2SB.setValue(100 - self.editShotUsageSB.value())
        
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
            prepareData.prepareComboBox(databaseOperation6, self.editShotUsage2CB, 1, 0)
        
    def populateFields(self):
        errorCode = 0

        memberIx = self.editShotByCB.findText(self.shooter, Qt.MatchFixedString)
        if memberIx >= 0:
            self.editShotByCB.setCurrentIndex(memberIx)
        else:
            errorCode = 1
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
            errorCode = 2
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
            errorCode = 3
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
            errorCode = 4
            self.alert(
                'Virhe',
                'Virhe',
                'Valitse sukupuoli',
                ''
            )
        
        self.editShotWeightLE.setText(str(self.shotWeight))
    
        if not self.shotInfo or self.shotInfo == 'None':
            self.editShotAdditionalInfoPT.setPlainText('')
        else:
            self.editShotAdditionalInfoPT.setPlainText(self.shotInfo)

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTableWithLimit(
            self.connectionArguments, 'public.kaadon_kasittely', f"kaato_id = {self.shotId}")
        if databaseOperation.errorCode != 0:
            errorCode = 5
            self.alert(
                'Vakava virhe',
                'Tietokantavirhe',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
            )
        else:
            self.usages = databaseOperation.resultSet
            self.editShotUsageCB.setCurrentIndex(
                self.shotUsageIdList.index(self.usages[0][1]))
            self.editShotUsageSB.setValue(self.usages[0][3])
            if len(self.usages) > 1:
                self.editShotUsage2CB.setEnabled(True)
                self.editShotUsage2CB.setCurrentIndex(
                    self.shotUsageIdList.index(self.usages[1][1]))
                self.editShotUsage2SB.setEnabled(True)
                self.editShotUsage2SB.setValue(self.usages[1][3])
                self.editShotUsage2CheckB.setChecked(True)
            else:
                self.editShotUsage2CB.setEnabled(False)
                self.editShotUsage2SB.setEnabled(False)
                self.editShotUsage2CheckB.setChecked(False)
            self.state = 0 if errorCode == 0 else -1



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

            # Check editShotAdditionalInfoPT to be set None if false and sent as NULL to the database
            if not self.editShotAdditionalInfoPT.toPlainText() or self.editShotAdditionalInfoPT.toPlainText() == '':
                additionalInfo = None
            else:
                additionalInfo = self.editShotAdditionalInfoPT.toPlainText()

            updateList = [
                shotById,
                str(self.editShotDE.date().toPyDate()),
                float(self.editShotWeightLE.text()),
                self.editShotLocationLE.text(),
                self.editShotAnimalCB.currentText(),
                self.editShotGenderCB.currentText(),
                self.editShotAgeCB.currentText(),
                additionalInfo
            ]

            columnNames = [
                'jasen_id',
                'kaatopaiva',
                'ruhopaino',
                'paikka_teksti',
                'elaimen_nimi',
                'sukupuoli',
                'ikaluokka',
                'lisatieto'
            ]

            columnValueString = ''
            for i in range(len(columnNames)):
                if updateList[i] is None:
                    columnValueString += f"{columnNames[i]} = NULL"
                else:
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
            else:
                self.state = -1
        

    def editUsage(self, shotUsageId, usageId, usageAmount):
        try:
            table = 'public.kaadon_kasittely'
            columnValueString = f"kasittelyid = {usageId!r}, kasittely_maara = {usageAmount!r}"
            limit = f"kaato_id = {self.shotId} AND kaadon_kasittely_id = {shotUsageId}"
        except:
            self.alert(
                'Virhe',
                'Virhe',
                'Tarkista syöte',
                ''
            )

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
        else:
            pass

    def addNewUsage(self, shotId, usageId, usageAmount):
        """_summary_

        Args:
            shotId (int): _description_
            usageId (int): _description_
            usagePortion (int): _description_
        """
        errorCode = 0

        sqlClauseBeginning = "INSERT INTO public.kaadon_kasittely(kaato_id, kasittelyid, kasittely_maara) VALUES("
        sqlClauseValues = f"{shotId!r}, {usageId!r}, {usageAmount!r})"
        sqlClauseEnd = ""
        sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        
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

    def deleteUsage(self, usageId, shotById):
        try:
            limit = f"kaadon_kasittely_id = {usageId!r} AND kaato_id = {shotById!r}"
        except Exception as e:
            self.alert(
                'Virhe',
                'Virhe',
                'Virhe poisto-operaatiossa',
                f'{str(e)}'
            )
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.deleteFromTable(self.connectionArguments, 'kaadon_kasittely', limit)
        if databaseOperation.errorCode != 0:
            self.alert('Vakava virhe', 'Tietokantaoperaatio epäonnistui', databaseOperation.errorMessage, databaseOperation.detailedMessage)


    def validateLineEdits(self):
        if self.editShotLocationLE.text().strip() and self.editShotWeightLE.text().strip():
            self.editShotSavePB.setEnabled(True)
        else:
            self.editShotSavePB.setEnabled(False)
    
    def editShotAndUsage(self):
        self.editShot()
        try:
            useIx = self.editShotUsageCB.currentIndex()
            use = self.shotUsageIdList[useIx]
            useAmount = self.editShotUsageSB.value()
        except:
            self.alert(
                'Virhe',
                'Virhe',
                'Tarkista syöte',
                ''
            )
            return

        self.editUsage(self.usages[0][0], use, useAmount)
        if self.editShotUsage2CheckB.isChecked() and len(self.usages) > 1:
            try:
                useIx2 = self.editShotUsage2CB.currentIndex()
                use2 = self.shotUsageIdList[useIx2]
                use2Amount = self.editShotUsage2SB.value()
                self.editUsage(self.usages[1][0], use2, use2Amount)
            except:
                self.alert(
                    'Virhe',
                    'Virhe',
                    'Tarkista syöte',
                    ''
                )
                return
        elif self.editShotUsage2CheckB.isChecked() and len(self.usages) == 1:
            try:
                useIx2 = self.editShotUsage2CB.currentIndex()
                use2 = self.shotUsageIdList[useIx2]
                use2Amount = self.editShotUsage2SB.value()
                self.addNewUsage(self.shotId, use2, use2Amount)
            except:
                self.alert(
                    'Virhe',
                    'Virhe',
                    'Tarkista syöte',
                    ''
                )

        # Check for second usage to delete
        if not self.editShotUsage2CheckB.isChecked() and len(self.usages) > 1:
            secondUsageId = self.usages[1][0]
            self.deleteUsage(secondUsageId, self.shotId)

        self.editShotLocationLE.clear()
        self.editShotWeightLE.clear()
        self.editShotAdditionalInfoPT.clear()
        self.editShotUsageSB.setValue(100)
        msg().successMessage("Muutokset tallennettu")

    def onTableItemClicked(self, item):
        selectedRow = item.row()
        self.shooterId = self.editShotTW.item(selectedRow, 0).text()
        self.shooter = self.editShotTW.item(selectedRow, 1).text()
        self.shotDate = self.editShotTW.item(selectedRow, 2).text()
        self.shotLocation = self.editShotTW.item(selectedRow, 3).text()
        self.shotAnimal = self.editShotTW.item(selectedRow, 4).text()
        self.shotAge = self.editShotTW.item(selectedRow, 5).text()
        self.shotGender = self.editShotTW.item(selectedRow, 6).text()
        self.shotWeight = self.editShotTW.item(selectedRow, 7).text()
        self.shotInfo = self.editShotTW.item(selectedRow, 8).text()
        self.shotId = int(self.editShotTW.item(selectedRow, 9).text())

        self.editShotPopulatePB.setEnabled(True)

    def compareUpdates(self, updateList):
        originalList = [
            int(self.shooterId),
            str(date.fromisoformat(self.shotDate)),
            float(self.shotWeight),
            self.shotLocation,
            self.shotAnimal,
            self.shotAge,
            self.shotGender,
            self.shotInfo
        ]
        
        for i in range(len(updateList)):
            if updateList[i] != originalList[i]:
                return False
        return True
    
    def closeDialog(self):
        self.close()


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
    