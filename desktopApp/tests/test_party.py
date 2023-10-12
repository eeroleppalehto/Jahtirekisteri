# TESTS FOR THE party.py MODULE

# LIBRARIES AND MODULES

import sys
# Add parent directory to the path
sys.path.append('../desktopApp')

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

def test_createPartyObjectNone():
    partyTuple = (1, 'Seurue1', None, None)

    testParty = party.Party(*partyTuple)
    
    assert testParty.partyShare == 0

def test_createGroupObject():
    groupTuple = (1, "Ryhmä1", 4.0, 200)


    testGroup = party.Group(*groupTuple)

    assert testGroup.groupId == 1

def test_createGroupObjectNone():
    groupTuple = (1, "Ryhmä1", None, None)


    testGroup = party.Group(*groupTuple)

    assert testGroup.groupMeats == 0


def test_groupMethodExpectedMeats():
    groupTuple = (1, "Ryhmä1", 4.0, 200)

    testGroup = party.Group(*groupTuple)

    testGroup.expectedMeat(10.0, 1000.0)

    assert testGroup.expectedMeats == 400.0


def test_groupMethodColor():
    groupTuple = (1, "Ryhmä1", 4.0, 200.0)

    testGroup = party.Group(*groupTuple)

    testGroup.expectedMeat(10.0, 1000.0)

    rgbValue = testGroup.color()

    assert rgbValue == "rgb(127.5,255,0)"


def test_partyMethodSetGroups():
    # group tuple in form of (groupId, groupName, partyId, groupShare, groupMeats)

    groups = [
        (1, "Ryhmä1", 1, 4.0, 200.0),
        (2, "Ryhmä2", 1, 4.0, 500.0),
        (3, "Ryhmä3", 1, 2.0, 50.0),
        (4, "Ryhmä4", 1, 3.0, 500.0)
    ]
    
    partyTuple = (1, 'Seurue1', 1000, 10.0)

    testParty = party.Party(*partyTuple)

    testParty.setGroups(groups)

    assert testParty.groupList[2].groupName == "Ryhmä3"





def test_partyMethodgetSankeyData():
    groups = [
        (1, "Ryhmä1", 1, 4.0, 200.0),
        (2, "Ryhmä2", 1, 4.0, 500.0),
        (3, "Ryhmä3", 1, 2.0, 50.0),
        (4, "Ryhmä4", 1, 3.0, 500.0)
    ]
    
    partyTuple = (1, 'Seurue1', 1000, 10.0)

    testParty = party.Party(*partyTuple)

    testParty.setGroups(groups)

    testSankeyData = testParty.setSankeyData()

    assert testSankeyData[2][2] == 50.0


def test_partyMethodgetSankeyDataNone():
    groups = [
        (1, "Ryhmä1", 1, 4.0, 200.0),
        (2, "Ryhmä2", 1, 4.0, 500.0),
        (3, "Ryhmä3", 1, None, None),
        (4, "Ryhmä4", 1, 3.0, 500.0)
    ]
    
    partyTuple = (1, 'Seurue1', 1000, 10.0)

    testParty = party.Party(*partyTuple)

    testParty.setGroups(groups)

    testSankeyData = testParty.setSankeyData()

    assert testSankeyData[2][2] == 0