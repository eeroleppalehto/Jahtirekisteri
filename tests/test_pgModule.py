# TESTS FOR THE pgmodule.py MODULE

# LIBRARIES AND MODULES

import sys
import json
# Add parent directory to the path
sys.path.append('../Jahtirekisteri_Eero')

from Jahtirekisteri import pgModule

# Create databaseOperation-object for tests
databaseOperation = pgModule.DatabaseOperation()

# TESTS

def test_createConnectionArgumentDict():
    testDictionary = databaseOperation.createConnectionArgumentDict(
        "metsastys",
        "application",
        "Q2werty"
    )

    expected_dictionary = dict(
        server = "localhost",
        database = "metsastys",
        user = "application",
        password = "Q2werty",
        port = "5432"
    )

    assert testDictionary == expected_dictionary

def test_saveDatabaseSettingsToFile():
    settingsDict = dict(
        server = "localhost",
        database = "metsastys",
        user = "application",
        password = "Q2werty",
        port = "5432"
    )

    fileName = 'testSettings.dat'

    databaseOperation.saveDatabaseSettingsToFile(fileName,settingsDict)

    settingsFile = open(fileName, "r")
    readSettings = json.load(settingsFile)
    settingsFile.close()

    assert readSettings == settingsDict


def test_readDatabaseSettingsFromFile():
    fileName = 'testSettings.dat'
    readSettings = databaseOperation.readDatabaseSettingsFromFile(fileName)

    settingsDict = dict(
        server = "localhost",
        database = "metsastys",
        user = "application",
        password = "Q2werty",
        port = "5432"
    )

    assert readSettings == settingsDict

def test_getAllrowsFromTable():

    connectionSettings = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')

    table = "public.seurue"

    databaseOperation.getAllRowsFromTable(connectionSettings, table)
    firstColumnHeader = databaseOperation.columnHeaders[0]

    assert firstColumnHeader == 'seurue_id'


def test_insertRowToTable():
    connectionSettings = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')

    sqlStart = f"INSERT INTO public.jasen(etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka) VALUES("
    sqlValues = f"'Teemu', 'Vuori', 'Eeronkuja 3', '21200', 'Raisio'"
    sqlEnd = ");"

    sqlCommand = sqlStart + sqlValues + sqlEnd

    databaseOperation.insertRowToTable(connectionSettings, sqlCommand)
    errorMessage = databaseOperation.errorMessage

    assert errorMessage == 'Lisättiin tietue onnistuneesti'

def test_updateTable():
    connectionSettings = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')
    table = "public.jasen"
    column = "etunimi"
    value = "'Eero'"
    limit = "public.jasen.sukunimi = 'Vuori' AND public.jasen.postitoimipaikka = 'Raisio'"

    databaseOperation.updateTable(connectionSettings, table, column, value, limit)
    message = databaseOperation.detailedMessage

    assert message == 'Update was successful'

def test_deleteFromTable():
    connectionSettings = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')
    table = "public.jasen"
    limit = "public.jasen.sukunimi = 'Vuori' AND public.jasen.postitoimipaikka = 'Raisio'"

    databaseOperation.deleteFromTable(connectionSettings, table, limit)
    message = databaseOperation.detailedMessage

    assert message == 'Delete operation was successful'

def test_callFunction():
    connectionSettings = databaseOperation.readDatabaseSettingsFromFile('testSettings.dat')
    func = 'public.get_party'
    params = 1

    databaseOperation.callFunction(connectionSettings, func, params)
    message = databaseOperation.detailedMessage

    assert message == 'Function call was succesful'