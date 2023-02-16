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
        print(databaseOperation1.errorMessage + ', ' +
                databaseOperation1.detailedMessage)
    else:
        killSet = databaseOperation1.resultSet
        if killSet != []: # TODO: include this condition on previous if-statement
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
        "Koko": 1,
        "Puolikas": 2,
        "Neljännes": 4
    }

     # Create group list to 
    groups = []
    i = 0
    for group in sharedMeats: # TODO: Check for possible output errors
        if shareGroupSummary[i][2] == None or shareGroupSummary[i][2] == 0:
            i += 1
            continue
        else:
            groups.append( # Add group index to dict?
                {
                    "groupName": group[0],
                    "sharedMeat": checkNoneType(group[1]),
                    "shareMultiplier": checkNoneType(shareGroupSummary[i][2]),
                    "expectedValue": 0.0,
                    "expectedAndShareDelta": 0.0,
                }
            )
            i += 1
    
    portionWeight = kill["Weight"]/portionDict[portion]
    meatSharedTotal = kill["Weight"] # or =0 ?
    multiplierTotal = 0
    for group in groups:
        meatSharedTotal += group["sharedMeat"]
        multiplierTotal += group["shareMultiplier"]

    # 
    # deltaList = []
    for group in groups:
        # E = TotalMeat * shareMult/TotalMult
        group["expectedValue"] = meatSharedTotal * (group["shareMultiplier"] / multiplierTotal)
        group["expectedAndShareDelta"] = group["expectedValue"] - group["sharedMeat"]
        # deltaList.append(group["expectedAndShareDelta"])


    resultList = []
    resultString = ""
    j = 0
    for k in range(0, portionDict[portion]):
        deltaList = []
        for group in groups:
            deltaList.append(group["expectedAndShareDelta"])
        maxDelta = max(deltaList)
        maxDeltaId = deltaList.index(maxDelta)
        groups[maxDeltaId]['expectedAndShareDelta'] -= portionWeight
        resultString += f"{groups[maxDeltaId]['groupName']}, {groups[maxDeltaId]['expectedAndShareDelta']}\n"
    

    return resultString











def checkNoneType(value):
    if value == None:
        return 0.0
    else:
        return value

# TODO: Make test data and test the algorithm for consistency
# TODO: Button + DialogueWindow to add suggested share to database
# TODO: Run the module through with debug mode

if __name__ == "__main__":
    testText = suggestion(6, "Neljännes")
    print(testText)
    print("--------------------------")
    testText = suggestion(2, "Puolikas")
    print(testText)