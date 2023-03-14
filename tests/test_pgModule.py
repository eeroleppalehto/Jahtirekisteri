# TESTS FOR THE pgmodule.py MODULE

# LIBRARIES AND MODULES
import sys
sys.path.append('../Jahtirekisteri_Eero')

import pgModule

databaseOperation = pgModule.DatabaseOperation()



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