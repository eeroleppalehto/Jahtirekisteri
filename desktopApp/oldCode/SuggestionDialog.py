# DIALOG WINDOW FOR SUGGESTING AND SAVING KILLS TO GROUPS
# =======================================================

# LIBRARIES AND MODULES

import sys
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame, SuccessfulOperationDialog
import pgModule as pgModule
import prepareData as prepareData
import suggestion


# CLASS DEFINITIONS FOR THE DILAOG WINDOW

class Suggestion(DialogFrame):
    """Creates a dialog to remove member from database"""
    # TODO: Change from using delete from database to changing members status to deactive('poistunut')
    # Constructor
    def __init__(self):

        super().__init__()

        loadUi("ui/suggestionDialog.ui", self)

        self.setWindowTitle('Ehdota jako')

        # Elements
        self.suggestionKillsTW = self.suggestionKillsTableWidget

        self.suggestionPortionCB = self.suggestionPortionComboBox
        self.suggestionDE = self.suggestionDateEdit
        self.suggestionDE.setDate(self.currentDate)
        self.suggestionSuggestPushBtn = self.suggestionSuggestPushButton
        self.suggestionSuggestPushBtn.clicked.connect(self.makeSuggestion) # Signal
        self.suggestionTE = self.suggestionTextEdit
        self.suggestionCancelPushBtn = self.suggestionCancelPushButton
        # self.suggestionCancelPushBtn.clicked.connect(self.removeMember) # Signal
        self.suggestionSavePushBtn = self.suggestionSavePushButton
        #s elf.suggestionSavePushBtn.clicked.connect(self.closeDialog) # Signal

        # Populate the member combo box
        self.populateSuggestionDialog()
    
    def populateSuggestionDialog(self):

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
            self.shareKillIdList = prepareData.prepareTable(databaseOperation1, self.suggestionKillsTW)
        
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
                databaseOperation2, self.suggestionPortionCB, 0, 0)

    def makeSuggestion(self):
            # TODO: TryExcept
            KillChosenRowIx = self.suggestionKillsTW.currentRow()
            killId = int(self.suggestionKillsTW.itemAt(KillChosenRowIx, 0).text())
            portion = self.suggestionPortionCB.currentText()

            plainText = suggestion.suggestion(killId, portion)
            self.suggestionTE.setPlainText(plainText)
        # try:
        #     pass
        # except:
        #     self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','Jaahas')
        

    # TODO: Add table click to choose kill to operate on
    def saveSuggestion(self):
        try:
            shareKillChosenRowIx = self.shareKillsTW.currentRow()
            shareKill = int(self.shareKillsTW.itemAt(shareKillChosenRowIx, 0).text()) # FIXME: Check if row and column are correctly placed
            shareDay = self.shareDE.date().toPyDate()
            portion = self.sharePortionCB.currentText()
            weight = float(self.shareAmountLE.text())
            shareGroupChosenItemIx = self.shareGroupCB.currentIndex()
            shareGroup = self.shareGroupIdList[shareGroupChosenItemIx]
            

            # Insert data into kaato table
            # Create a SQL clause to insert element values to the DB
            sqlClauseBeginning = "INSERT INTO public.jakotapahtuma(paiva, ryhma_id, osnimitys, maara, kaato_id) VALUES("
            sqlClauseValues = f"'{shareDay}', {shareGroup}, '{portion}', {weight}, {shareKill}"
            sqlClauseEnd = ");"
            sqlClause = sqlClauseBeginning + sqlClauseValues + sqlClauseEnd
        except:
            self.alert('Virheellinen syöte', 'Tarkista antamasi tiedot', 'Jotain meni pieleen','hippopotamus' )
        
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

class TestMainWindow(QMainWindow):
    """Main Window for testing dialogs."""

    def __init__(self):
        super().__init__()

        self.setWindowTitle('Pääikkuna dialogien testaukseen')

        # Add dialogs to be tested here and run them as follows:
        saveDBSettingsDialog = Suggestion()
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


