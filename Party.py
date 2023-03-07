# MODULE FOR PARTY AND GROUP CLASS DEFINITIONS

# IMPORTS AND MODULES

class Party():
    """docstring for ClassName."""
    def __init__(self, partyId, partyName, partyMeat, partyShare):
        self.partyId = partyId
        self.partyName = partyName

        if partyMeat == None:
            self.partyMeat = 0
        else:
            self.partyMeat = partyMeat

        if partyShare == None:
            self.partyShare = 0
        else:
            self.partyShare = partyShare
        

    def getGroups(self, groupList):
        self.groupList = []


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

        if groupShare == None:
            self.groupShare = 0
        else:
            self.groupShare = groupShare

        if groupMeats == None:
            self.groupMeats = 0
        else:
            self.groupMeats = groupMeats

    def expectedMeat(self, partyShare, partyMeat):
        # TODO: Make checks for 0 values!
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
    testParty.getGroups(groupList)

    print(testParty.getSankeyData())
    print(testParty.getSankeyColors())
