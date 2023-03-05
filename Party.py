# MODULE FOR PARTY AND GROUP CLASS DEFINITIONS

# IMPORTS AND MODULES

import pgModule

class Party():
    """docstring for ClassName."""
    def __init__(self, partyId, connectionArguments):
        self.connectionArguments = connectionArguments

        databaseOperation = pgModule.DatabaseOperation()
        databaseOperation.callFunction(self.connectionArguments, 'public.get_party_portion_amount', partyId)
        
        #Check if an error has occurred
        if databaseOperation.errorCode != 0:
            self.alert( # TODO: Make error handeling
                'Vakava virhe',
                'Tietokantaoperaatio epäonnistui',
                databaseOperation.errorMessage,
                databaseOperation.detailedMessage
                )
        else: 
            self.partyId = databaseOperation.resultSet[0]
            self.partyName = databaseOperation.resultSet[1]
            self.partyMeat = databaseOperation.resultSet[2]
            self.partyShare = databaseOperation.resultSet[3]

        self.getGroups()

    def getGroups(self):
        self.groupList = []
        databaseOperation2 = pgModule.DatabaseOperation
        databaseOperation2.getAllRowsFromTable(self.connectionArguments, 'public.jakoryhma_osuus_maara')
        groupList = databaseOperation2.resultSet


        for group in groupList:
            if group[2] == self.partyId:
                newGroup = Group(group[0], group[1], group[3], group[4])
                self.groupList.append(newGroup)

    def getSankeyData(self):
        sankeyData = []
        for group in self.groupList:
            sankeyRow = (self.partyName, group.groupName, group.groupMeats)
            sankeyData.append(sankeyRow)

        return sankeyData

    def getSankeyColors(self):
        sankeyColors = []
        for group in self.groupList:
            group.expectedMeat(self.partyShare, self.partyMeat)
            sankeyColors.append(group.color())
        return sankeyColors
    

class Group():
    """_summary_
    """

    def __init__(self, groupId, groupName, groupShare, groupMeats):
        self.groupId = groupId
        self.groupName = groupName
        self.groupShare = groupShare
        self.groupMeats = groupMeats

    def expectedMeat(self, partyShare, partyMeat):
        # TODO: Make checks for 0 values!
        self.expectedMeats = self.groupShare*partyMeat/partyShare
        self.deltaMeats = (self.groupMeats - self.expectedMeats)/self.expectedMeats

    def color(self):
        if self.deltaMeats > 0:
            pass
        elif self.deltaMeats <= 0:
            pass