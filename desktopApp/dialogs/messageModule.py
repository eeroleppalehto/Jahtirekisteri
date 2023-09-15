from PyQt5.QtWidgets import QMessageBox
from PyQt5.QtCore import QTimer

# MESSAGE MODULE

class PopupMessages(QMessageBox):
    def __init__(self):
        super().__init__()
        
        self.timer = QTimer(self)
        
    
    def successMessage(self, message):
        """Popup message box: success (QMessageBox)

        Args:
            message (str): Message to display
        """
        self.setIcon(QMessageBox.Information)
        self.setWindowTitle("Valmis")
        self.setText(message)
        self.timer.timeout.connect(self.accept)
        # Automatically closes popup in milliseconds
        self.timer.start(2000)
        self.exec_()

    def failureMessage(self, message):
        """Popup message box: critical (QMessageBox)

        Args:
            message (str): Message to display
        """
        self.setIcon(QMessageBox.Critical)
        self.setWindowTitle("Virhe")
        self.setText(message)
        self.timer.timeout.connect(self.accept)
        # Automatically closes popup in milliseconds
        self.timer.start(2000)
        self.exec_()

    def warningMessage(self, message):
        """Popup message box: warning (QMessageBox)

        Args:
            message (str): Message to display
        """
        self.setIcon(QMessageBox.Warning)
        self.setWindowTitle("Varoitus")
        self.setText(message)
        self.timer.timeout.connect(self.accept)
        # Automatically closes popup in milliseconds
        self.timer.start(2000)
        self.exec_()

    def informationMessage(self, message):
        """Popup message box: information (QMessageBox)

        Args:
            message (str): Message to display
        """
        self.setIcon(QMessageBox.Information)
        self.setWindowTitle("?")
        self.setText(message)
        self.timer.timeout.connect(self.accept)
        # Automatically closes popup in milliseconds
        self.timer.start(2000)
        self.exec_()

