# MODULE FOR PARTY AND GROUP CLASS DEFINITIONS

# IMPORTS AND MODULES

import pgModule

class Party():
    """docstring for ClassName."""
    def __init__(self, partyId, databaseOperation):
        databaseOperationConnections = pgModule.DatabaseOperation()
        self.connectionArguments = databaseOperationConnections.readDatabaseSettingsFromFile('connectionSettings.dat')



        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.callProcedure()
        
        #Check if an error has occurred
        if databaseOperation.errorCode != 0:
            self.alert(
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else: 
            pass

    def groupList(self):
        pass

    def partyMeat(self):
        pass
    
    def partyShare(self):
        pass

    def sankeyData(self):
        pass

    def sankeyColors(self):
        pass
    

class Group():
    """_summary_
    """

    def __init__(self, groupName, groupShare, groupMeats):
        self.groupName = groupName
        self.groupShare = groupShare
        self.groupMeats = groupMeats

    def expectedMeat(self, partyShare, partyMeat):
        self.expectedMeats = self.groupShare*partyMeat/partyShare
        self.deltaMeats = self.groupMeats - self.expectedMeats

    def color(self):
        if self.deltaMeats > 0:
            pass
        elif self.deltaMeats <= 0:
            pass