import sys
# Add parent directory to the path
sys.path.append('../desktopApp')
from PyQt5 import QtCore
from PyQt5.QtWidgets import QDialog, QPushButton, QComboBox
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.uic import loadUi
from dialogs.dialogueWindow import DialogFrame
import pgModule as pgModule
import figures


class GraphDialog(DialogFrame):
    """ Creates a dialog to show graphs """
    
    def __init__(self):
        super().__init__()
        
        loadUi("ui/graphDialog.ui", self)
        
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')

        self.setWindowTitle('Grafiikkaa')
        
        self.graphWebEV: QWebEngineView = self.graphWebEngineView
        self.graphClosePushBtn: QPushButton = self.graphClosePushButton
        self.graphCB: QComboBox = self.graphComboBox
        self.graphCB.currentIndexChanged.connect(self.handleSankeyCBChange)
        
        self.graphClosePushBtn.clicked.connect(self.closeDialog)
        
        self.populateGraph()
    
    
    def populateGraph(self):
        self.graphCB.clear()
        self.graphCB.addItems(['Kilogrammat', 'Määrä', 'Scatter'])
        
    def handleSankeyCBChange(self):
        if self.graphCB.currentText() == 'Kilogrammat':
            self.loadSankeyChartKG()
        elif self.graphCB.currentText() == 'Määrä':
            self.loadSankeyChartAmount()
        elif self.graphCB.currentText() == 'Scatter':
            self.loadScatterChart()

    def loadSankeyChartKG(self):
        # Populate the sankey chart
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_jasen_jako_kg')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            try:
                #sankeyData = prepareData.prepareSankeyData(databaseOperation7.resultSet)
                
                htmlFileName = 'memberShareStreamsKg.html'
                urlString = f'file:///{htmlFileName}'
                sankeyFig = figures.createSankeyChart(databaseOperation.resultSet, [], [], [], 'Jako kiloina')
                figures.createOfflineFile(sankeyFig, htmlFileName)
                url = QtCore.QUrl(urlString)
                self.graphWebEV.load(url)
                
                # self.shareSankeyWebView.setHtml(sankeyFig.to_html(include_plotlyjs='cdn'))
            except:
                self.alert(
                    'Vakava virhe',
                    'Sankey-kaavion luonti epäonnistui',
                    'Sankey chart failed to load on share page',
                    'Oops'
                )
    
    def loadSankeyChartAmount(self):
        # Populate the sankey chart
        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_jasen_jako_kpl')
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else:
            try:
                #sankeyData = prepareData.prepareSankeyData(databaseOperation7.resultSet)
                
                htmlFileName = 'memberShareStreamsKg.html'
                urlString = f'file:///{htmlFileName}'
                sankeyFig = figures.createSankeyChart(databaseOperation.resultSet, [], [], [], 'Jako lukumäärinä')
                figures.createOfflineFile(sankeyFig, htmlFileName)
                url = QtCore.QUrl(urlString)
                self.graphWebEV.load(url)
                
                # self.shareSankeyWebView.setHtml(sankeyFig.to_html(include_plotlyjs='cdn'))
            except:
                self.alert(
                    'Vakava virhe',
                    'Sankey-kaavion luonti epäonnistui',
                    'Sankey chart failed to load on share page',
                    'Oops'
                )

    def loadScatterChart(self):
        # Fetch amount and weight data from database 
        
        databaseOperation1 = pgModule.DatabaseOperation()
        databaseOperation1.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_jasen_jako_kg')
        if databaseOperation1.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation1.errorMessage,
                databaseOperation1.detailedMessage
                )
            return
        
        databaseOperation2 = pgModule.DatabaseOperation()
        databaseOperation2.getAllRowsFromTable(
            self.connectionArguments, 'public.sankey_jasen_jako_kpl')
        if databaseOperation2.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation2.errorMessage,
                databaseOperation2.detailedMessage
                )
            return
        
        try:
            htmlFileName = 'memberShareScatter.html'
            urlString = f'file:///{htmlFileName}'
            xAxisList = [ item[2] for item in databaseOperation1.resultSet ]
            yAxisList = [ item[2] for item in databaseOperation2.resultSet ]
            nameList = [ item[1] for item in databaseOperation1.resultSet ]
            scatterFig = figures.createScatterChart(xAxisList, yAxisList, nameList)
            figures.createOfflineFile(scatterFig, htmlFileName)
            url = QtCore.QUrl(urlString)
            self.graphWebEV.load(url)
        except Exception as e:
            self.alert(
                'Vakava virhe',
                'Sankey-kaavion luonti epäonnistui',
                'Sankey chart failed to load on share page',
                str(e)
            )
    
    def closeDialog(self):
        self.close()