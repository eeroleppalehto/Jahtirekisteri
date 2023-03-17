# MODULE FOR PARTY AND GROUP CLASS DEFINITIONS

# IMPORTS AND MODULES

class Party():

    # Constructor for party object
    def __init__(self, partyId, partyName, partyMeat, partyShare):
        self.partyId = partyId
        self.partyName = partyName

        if partyMeat == None:
            self.partyMeat = 0.0
        else:
            self.partyMeat = partyMeat

        if partyShare == None:
            self.partyShare = 0.0
        else:
            self.partyShare = partyShare
        

    # Set groups for the party from a view 'public.jakoryhma_osuus_maara' from the database
    def setGroups(self, groupList):
        """Set groups for the party from a view 'public.jakoryhma_osuus_maara' from the database

        Args:
            groupList (list): list containing tuples of groupId, groupName, partyId, groupShare, groupMeats
        """
        self.groupList = []


        for group in groupList:
            if group[2] == self.partyId:
                newGroup = Group(group[0], group[1], group[3], group[4])
                self.groupList.append(newGroup)

    # Sets and returns sankey data to drawn in sankey diagrams
    def setSankeyData(self):
        """Sets and returns sankey data to drawn in sankey diagrams

        Returns:
            list: tuple as source, target, value
        """
        sankeyData = []
        for group in self.groupList:
            sankeyRow = (self.partyName, group.groupName, group.groupMeats)
            sankeyData.append(sankeyRow)

        return sankeyData

    def getSankeyColors(self):
        """Sets and returns traffic light colors for groups base on difference from expected meats

        Returns:
            list: list of rgb values as strings
        """
        sankeyColors = []
        for group in self.groupList:
            group.expectedMeat(self.partyShare, self.partyMeat)
            sankeyColors.append(group.color())
        return sankeyColors
    

class Group():

    # Constructor for group object
    def __init__(self, groupId, groupName, groupShare, groupMeats):
        self.groupId = groupId
        self.groupName = groupName

        if groupShare == None:
            self.groupShare = 0
        else:
            self.groupShare = groupShare

        if groupMeats == None:
            self.groupMeats = 0
        else:
            self.groupMeats = groupMeats

    # TODO: docstrings for expectedMeats and color methods
    def expectedMeat(self, partyShare, partyMeat):
        if partyShare == 0:
            self.expectedMeats = 0
            self.deltaMeats = 1
        else:
            self.expectedMeats = self.groupShare*partyMeat/partyShare
            if self.expectedMeats == 0:
                self.deltaMeats = 1
            else:
                self.deltaMeats = (self.groupMeats - self.expectedMeats)/self.expectedMeats

    def color(self):
        if self.deltaMeats > 0:
            green = 255 - 255*self.deltaMeats
            green = max(green, 0)
            return f"rgb(255,{green},0)"
        elif self.deltaMeats <= 0:
            red = 255 + 255*self.deltaMeats
            red = max(red, 0)
            return f"rgb({red},255,0)"
        
if __name__ == "__main__":
    testParty = Party(1,'Seurue1', 200.0, 5.0)
    groupList =[
        (1, 'Ryhmä1', 1, 2.0, 150.0),
        (2, 'Ryhmä2', 1, 2.0, 50.0)
    ]
    testParty.setGroups(groupList)

    print(testParty.setSankeyData())
    print(testParty.getSankeyColors())
