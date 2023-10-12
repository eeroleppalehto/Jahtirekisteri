# MODULE FOR PREPARING DATA TO DISPLAY IT ON QT WIDGETS
# =====================================================

# LIBRARIES AND MODULES
# ---------------------
# import pgModule
# from PyQt5.QtWidgets import *  Remove this line when ready
from PyQt5.QtWidgets import QTableWidgetItem  # For handling a single table cell
from PyQt5.QtCore import Qt  # For handling a single table cell

'''
# Temporary object to get help about object properties
resultObject = pgModule.DatabaseOperation()
testConnectionArgs = resultObject.readDatabaseSettingsFromFile('settings.dat')
resultObject.getAllRowsFromTable(
    testConnectionArgs, 'public.jakoryhma_yhteenveto')

tableWidget = QTableWidget()
'''

# DATA PREPARATION FUNCTIONS
# ---------------------------


def prepareTable(resultObject, tableWidget):
    """Updates an existing table widget using an instance of DatabaseOperation class 
    defined in the pgModule

    Args:
        resultObject (DatabaseOperation): Instance of DatabaseOperation class -> errors and results
        tableWidget (QTableWidget): Table widget to be updated
    """
    # Clear table widget before populating it
    tableWidget.clear()

    # If there is no error start processing rows and columns of the result set
    if resultObject.errorCode == 0:
        tableWidget.setRowCount(resultObject.rows)
        tableWidget.setColumnCount(resultObject.columns)
        tableWidget.setHorizontalHeaderLabels(resultObject.columnHeaders)

        rowIndex = 0 # Initialize row index
        for tupleIx in resultObject.resultSet: # Cycle through list of tuples
            columnIndex = 0 # Init column index

            for cell in tupleIx: # Cycle through values in the tuple
                cellData = QTableWidgetItem(str(cell)) # Format cell data
                cellData.setFlags(Qt.ItemIsEnabled) # Disable editing of the cell
                tableWidget.setItem(rowIndex, columnIndex, cellData) # Set cell

                columnIndex +=1

            rowIndex += 1        

def prepareComboBox(resultObject, comboBox, ixToShow, ixToReturn):
    """Prepares data to be shown in a combo box

    Args:
        resultObject (DatabaseOperation): Instance of DatabaseOperation class -> errors and results
        comboBox (QComboBox): Combo box to be updated
        ixToShow (int): Index of the column to show in the combo box
        ixToReturn (int): Index of the column containing values of interest

    Returns:
        list: Value of interest
    """
    # Clear combo box before populating it
    comboBox.clear()

    # Result set is a list of tuples even when there is only one column in the view
    cBValuesOfInterest = [] # Empty list for values of interest
    cBItems = []  # Empty list for choices in the combo box

    for result in resultObject.resultSet:
        cBValueOfInterest = result[ixToReturn] # Choose column to use as value of interest
        resultAsString = str(result[ixToShow]) # Convert element to show in the tuple as a string
        cBItems.append(resultAsString) # Append it to the choices list of the combo box
        cBValuesOfInterest.append(cBValueOfInterest) # Append the value to the list
    
    comboBox.addItems(cBItems) # Populate the combo box
    return cBValuesOfInterest       

def parseSharedPortionOfShot(tableData):
    """Function that parses data from table data to be view in the shared portion of shot table

    Args:
        tableData (list): Contains list of tuples containing (id, animal, portion, amount, usagePortion)

    Returns:
        list: Contains list of tuples containing (id, animal, sharedPortion, amount)
    """
    
    # Generate ids to new list and remove duplicates
    sharedKillsListId = [ row[0] for row in tableData ]
    sharedKillsListId = list(dict.fromkeys(sharedKillsListId))
    
    portionDict = {'Koko': 4, 'Puolikas': 2, 'Neljännes': 1}
    
    resultTableData = []
    # Iterate through ids
    for id in sharedKillsListId:
        # Initialize variables
        animal = ""
        sharedPortions = 0
        amount = 0
        shotUsagePortion = 0

        # Iterate through table data
        for row in tableData:
            if row[0] == id:
                animal = row[1]
                sharedPortions += portionDict[row[2]]
                amount += row[3]
                shotUsagePortion = row[4]/100
                
        # Calculate shared portions and append values to result table data
        sharedPortions = f"{int(sharedPortions*100/(4*shotUsagePortion))}%"
        resultTableData.append((id, animal, sharedPortions, amount))
    
    return resultTableData