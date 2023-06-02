# TESTS FOR THE prepareData.py MODULE

# LIBRARIES AND MODULES

import sys
# Add parent directory to the path
sys.path.append('../desktopApp')

import prepareData
import pgModule
from PyQt5.QtCore import *
from PyQt5.QtWidgets import (QComboBox, QTableWidget, QMainWindow, QApplication)
from PyQt5.uic import loadUi


class TestWindow(QMainWindow):

    # Constructor, a method for creating objects from this class
    def __init__(self):

        QMainWindow.__init__(self)

        loadUi('tests/testWindow.ui', self)

        self.testCB = self.testComboBox
        self.testTW = self.testTableWidget
    
app = QApplication(sys.argv)
testWindow = TestWindow()
databaseOperation = pgModule.DatabaseOperation()
connectionArgs = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')

def test_prepareComboBox():
    testCB = testWindow.testCB
    databaseOperation.getAllRowsFromTable(connectionArgs, 'public.kasittely')
    
    cbIdList = prepareData.prepareComboBox(databaseOperation, testCB, 1, 0)

    cbIx = testCB.currentIndex() # Row index of the selected row
    cBValue = cbIdList[cbIx] # Id value of the selected row

    assert cBValue == 1

def test_prepareTable():
    testTW = testWindow.testTW

    databaseOperation.getAllRowsFromTable(connectionArgs, 'public.seura')

    prepareData.prepareTable(databaseOperation, testTW)

    txt = testTW.itemAt(0,0).text()

    assert txt == '1'



