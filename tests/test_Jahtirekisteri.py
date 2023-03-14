# TESTS FOR THE Jahtirekisteri.py MODULE

# LIBRARIES AND MODULES

import sys
from PyQt5.QtWidgets import QApplication
# Add parent directory to the path
sys.path.append('../Jahtirekisteri_Eero')

import Jahtirekisteri

# Create MultipageMainWindow object for tests
app = QApplication(sys.argv)
appWindow = Jahtirekisteri.MultiPageMainWindow()

def test_defaulTabIndex():
    tabIndex = appWindow.pageTab.currentIndex()

    assert tabIndex == 0