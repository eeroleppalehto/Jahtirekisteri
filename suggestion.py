import pgModule

def suggestion(killId, portion): 
    """ Function that suggests which group should get what portion of the given kill

    Args:
        killId ( int ): Index number of kill to operate on
        portion ( str ): String which tells how many pieces was the kill cut to

    Returns:
        _type_: _description_ # TODO: Finsih return value for GUI
    """
    # Get database settings and get given kill from database based upon index value
    databaseOperation1 = pgModule.DatabaseOperation()
    conncectionArguments = databaseOperation1.readDatabaseSettingsFromFile('settings.dat')
    databaseOperation1.getAllRowsFromTable(conncectionArguments, 'public.kaato')
    if databaseOperation1.errorCode != 0:
        print(databaseOperation2.errorMessage + ', ' +
                databaseOperation2.detailedMessage)
    else:
        killSet = databaseOperation1.resultSet
        if killSet != []:
            for kill in killSet:
                if killId == kill[0]:
                    shareKill = kill
            # TODO: Check if kill exists
            kill = {
                "Id": killId,
                "Weight": shareKill[3] # TODO: Is weight as on kill or will it differ from that?
            }
        else:
            print("No kills to operate on.")
            return
        
    # Get group info from database # TODO: Make view to collect data under one source (and additionally add ryhma_id)
    databaseOperation2 = pgModule.DatabaseOperation()
    databaseOperation2.getAllRowsFromTable(
        conncectionArguments, 'public.jakoryhma_yhteenveto')
    if databaseOperation2.errorCode != 0:
        print("Problem accessing view public.jakoryhma_yhteenveto from database")
    else:
        shareGroupSummary = databaseOperation2.resultSet

    databaseOperation3 = pgModule.DatabaseOperation()
    databaseOperation3.getAllRowsFromTable(
        conncectionArguments, 'public.jaetut_lihat')
    if databaseOperation3.errorCode != 0:
        print("Problem accessing view public.jaetut_lihat from database")
    else:
        sharedMeats = databaseOperation3.resultSet

    # Dictionary of portions to give integer value to each string value
    portionDict ={
        "Kokonainen": 1,
        "Puolikas": 2,
        "Neljännes": 4
    }
    
    # Create group list to 
    groups = []
    i = 0
    for group in sharedMeats: # TODO: Check for possible output errors
        if shareGroupSummary[i][2] == None:
            i += 1
            continue
        else:
            groups.append( # Add group index to dict?
                {
                    "groupName": group[0],
                    "sharedMeat": checkNoneType(group[1]),
                    "shareMultiplier": checkNoneType(shareGroupSummary[i][2]),
                    "expectedValue": 0.0,
                    "deltaSquare": 0.0
                }
            )
            i += 1

    weightPortion = kill["Weight"]/portionDict[portion]
    meatSharedTotal = weightPortion
    multiplierTotal = 0
    for group in groups:
        meatSharedTotal += group["sharedMeat"]
        multiplierTotal += group["shareMultiplier"]

    deltaSum = 0
    for group in groups:
        # E = TotalMeat * shareMult/TotalMult
        group["expectedValue"] = meatSharedTotal * (group["shareMultiplier"] / multiplierTotal) 
        # Relative Variance = ((E-CurrentMeat)/E)^2
        group["deltaSquare"] = pow((group["expectedValue"] - group["sharedMeat"])/group["expectedValue"], 2) 
        # deltaGroup.append(group["deltaSquare"])
        deltaSum += group["deltaSquare"]

    # TODO: loop according to portions and track data
    resultString = ""
    resultGroups = []
    i = 0
    while i < portionDict[portion]:
        tempData = suggestionCalc(weightPortion, groups, deltaSum)
        groups = tempData[0]
        resultGroups.append(tempData[1])
        resultString += f"{tempData[1]} saa {portion},\n"
        i += 1

    # TODO: List of required agruments to make share inserts to database
    # ryhma_id, osnimitys, maara, kaato_id

    # insertList = []
    # for result in resultGroups:
    #     insertList.append(
    #         {

    #         }
    #     )

    return resultString


def suggestionCalc(weight, groups, deltaSum): 
    """ Calculates minimal relative variance from values given by function
        suggestion and determines which group receives the portion

    Args:
        weight ( float ): weight of the portion operated on
        groups ( list ): info of groups
        deltaSum ( float ): sum of variances of each group from their expected shared meat value

    Returns:
        list: list containing updated group info, name of the group receiving the portion, updated sum of deltas
    """

    shareMeatVar = 0
    varianceList = []

    for group in groups:
        shareMeatVar = group["sharedMeat"] + weight # FIXME: Kill not yet implemented

        varianceList.append(
            deltaSum - group["deltaSquare"] + pow((shareMeatVar - group["expectedValue"])/group["expectedValue"], 2)
        )
    
    minVarianceId = varianceList.index(min(varianceList))
    
    groups[minVarianceId]["sharedMeat"] += weight # FIXME: Kill not yet implemented

    # Update deltaSum value
    deltaSum = min(varianceList)

    resultList = [
        groups,
        groups[minVarianceId]["groupName"],
        deltaSum
    ]
    
    return resultList

def checkNoneType(value):
    if value == None:
        return 0.0
    else:
        return value

# TODO: Make test data and test the algorithm for consistency
# TODO: Button + DialogueWindow to add suggested share to database

if __name__ == "__main__":
    testText = suggestion(6,"Neljännes")
    print(testText)
    testText = suggestion(2,"Puolikas")
    print(testText)