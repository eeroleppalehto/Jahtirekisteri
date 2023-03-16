# TESTS FOR THE party.py MODULE

# LIBRARIES AND MODULES

import sys
# Add parent directory to the path
sys.path.append('../Jahtirekisteri_Eero')

import party

partyData = [
    (1, 'Seurue1', 1000, 10.0),
    (2, 'Seurue2', 2000, 18.0)
]

def test_createPartyObject():
    partyTuple = (1, 'Seurue1', 1000, 10.0)

    testParty = party.Party(
        partyTuple[0],
        partyTuple[1],
        partyTuple[2],
        partyTuple[3]
        )
    
    assert testParty.partyShare == 10.0

def test_createGroupObject():
    pass