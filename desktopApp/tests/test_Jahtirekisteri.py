# TESTS FOR THE Jahtirekisteri.py MODULE

# LIBRARIES AND MODULES

import sys
from PyQt5.QtWidgets import QApplication
from PyQt5 import QtCore
# Add parent directory to the path
sys.path.append('../Jahtirekisteri_Eero')

import Jahtirekisteri


def test_defaulTabIndex(qtbot):
    app = Jahtirekisteri.MultiPageMainWindow()

    qtbot.addWidget(app)

    
    tabIndex = app.pageTab.currentIndex()

    assert tabIndex == 0

# def test_changingTab(qtbot):
#     app = Jahtirekisteri.MultiPageMainWindow()

#     qtbot.addWidget(app)

#     qtbot.keyClick(app.pageTab, QtCore.Qt.Key_Right)

#     tabIndex = app.pageTab.currentIndex()

#     assert tabIndex == 1
