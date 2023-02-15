# FOR CREATING VARIOUS PLOTLY FIGURES
# ===================================

# LIBRARIES AND MODULES
# ----------------------
import plotly.graph_objects as charts
import plotly.offline as offline
import numpy as np

# FUNCTIONS

def testChart():
    """Creates a Sankey chart for testing

    Returns:
        obj: plotly figure object
    """
    # An HTML file for saving the plot when offline
    htmlFileName = 'meatstreams.html'
    
    # Labels for the sankey chart (from a view)
    sourceLabels = ['Hirvi', 'Peura'] # Where the meat is coming from
    targetLabels = ['Ryhmä 1', 'Ryhmä 2', 'Ryhmä 3'] # Which group has received meat
    allLabels = sourceLabels + targetLabels # All labels for the chart in a single list

    # Simulation Data (list of tuples), in reality the data should come from the database view 
    dBdata = [('Hirvi', 'Ryhmä 1', 100),
        ('Hirvi', 'Ryhmä 2', 200),
        ('Hirvi', 'Ryhmä 3', 100),
        ('Peura', 'Ryhmä 2', 50)
        ]

    # Define colors for meat sources (animals) -> for sending nodes ie. left side boxes in the chart
    sourceNodeColors = ['rgba(128, 128, 128, 0.75)', 'rgba(150, 50, 0, 0.75)' ] # Alpha (opacity) 0 - 1 

    # Define colors for meat targets (group) -> for receiving nodes ie. right side boxes in the chart
    targetNodeColors = ['red', 'orange', 'green'] # CSS named colors

    # All label colors in a single list for the chart
    allColors = sourceNodeColors + targetNodeColors 

    # Empty lists for label indexes and values
    sankeySources = []
    sankeyTargets = []
    sankeyValues = []

    # Create indexes for the Sankey chart
    for row in dBdata:
        tupleSource = row[0]
        tupleTarget = row[1]
        tupleValue = row[2]
        sourceIx = allLabels.index(tupleSource)
        targetIx = allLabels.index(tupleTarget)
        sankeySources.append(sourceIx)
        sankeyTargets.append(targetIx)
        sankeyValues.append(tupleValue)


    figure = charts.Figure(data=[charts.Sankey(
        node = dict(
        pad = 15,
        thickness = 20,
        line = dict(color = "black", width = 0.5),
        label = allLabels,
        color = allColors
        ),
        link = dict(
        source = sankeySources, 
        target = sankeyTargets,
        value = sankeyValues,
        color = 'rgba(255, 128, 0, 0.5)'
    ))])

    # figure.update_layout(title_text="Lihanjakotilanne", font_size=16)
    # figure.update_traces(orientation='v', selector=dict(type='sankey'))
    offline.plot(figure, filename= htmlFileName) # Write the chart to an html file
    

def createSankeyChart(dBData, sourceColors, targetColors, linkColors, heading):
    """Creates a Sankey chart from database data

    Args:
        dBData (list): List of tuples (source, target, value)
        sourceColors (list): list of CSS colors or rgba values
        targetColors (list): list of CSS colors or rgba values
        linkColors (list): list of CSS colors or rgba values
        heading (str): A heading for the chart

    Returns:
        obj: plotly figure
    """
    # Labels for the sankey chart (from dBData)
    
    allLabels = [] # All sources and targets in a single list <- dBdata
    
    for data in dBData:
        allLabels.append(data[0])
    for data in dBData:
        allLabels.append(data[1])
    
    allLabels = list(dict.fromkeys(allLabels)) # FIXME: Needed?
    # print(allLabels)
    # allLabels = ['Hirvi', 'Seuralle', 'Seurueelle', 'Ryhmä 1', 'Ryhmä 3']

    ## Define colors for meat sources (animals) -> for sending nodes ie. left side boxes in the chart
    #sourceNodeColors = sourceColors # Alpha (opacity) 0 - 1 
    
    ## Define colors for meat targets (group) -> for receiving nodes ie. right side boxes in the chart
    #targetNodeColors = targetColors # CSS named colors

    if sourceColors == []:
        lenSources = len(allLabels) - len(targetColors)
        # Generate source colors
        for i in range(0, lenSources):
            color = 180 + i*5
            sourceColors.append(f"rgb(0, {color}, {color})")

    
    allColors = sourceColors + targetColors

    ## All label colors in a single list for the chart
    # allColors = sourceNodeColors + targetNodeColors

    # allColors = []
    # k = 0
    # for data in dBData:
    #     if data[0] == "Seurueelle":
    #         break
    #     k += 1

    # if allColors == []:
    #     for i in range(0, len(allLabels)):
    #         if i<=k:
    #             color = 180 + i*5
    #             allColors.append(f"rgb(0, {color}, {color})")
    #         else:
    #             color = tuple(np.random.choice(range(256), size=3))
    #             allColors.append(f"rgb{color}")
    
    if linkColors == []:
        # for i in range(0, 10):
        #     color = tuple(np.random.choice(range(256), size=3))
        #     linkColors.append(f"rgb{color}")

        for i in range(0, len(allLabels)):
            color = 180 + i*5
            linkColors.append(f"rgb(155, {color}, {color})")
    
    # Empty lists for label indexes and values
    sankeySources = []
    sankeyTargets = []
    sankeyValues = []

    # Create indexes for the Sankey chart
    for row in dBData:
        tupleSource = row[0]
        tupleTarget = row[1]
        tupleValue = row[2]
        sourceIx = allLabels.index(tupleSource)
        targetIx = allLabels.index(tupleTarget)
        sankeySources.append(sourceIx)
        sankeyTargets.append(targetIx)
        sankeyValues.append(tupleValue)

    # print(sankeySources)

    figure = charts.Figure(data=[charts.Sankey(
        node = dict(
            pad = 15,
            thickness = 20,
            line = dict(color = "black", width = 0.5),
            label = allLabels,
            color = allColors
        ),
        link = dict(
            source = sankeySources, 
            target = sankeyTargets,
            value = sankeyValues,
            color = linkColors
    ))])

    figure.update_layout(title_text=heading, font_size=16)
    # figure.update_traces(orientation='v', selector=dict(type='sankey'))
    return figure

def createOfflineFile(figure, htmlFileName):
    """Creates an html file from the chart for offline use

    Args:
        figure (obj): The chart to bring to offline
        htmlFileName (str): name of the file to save into disk
    """
    offline.plot(figure, filename= htmlFileName) # Write the chart to an html file

def colors(sankeyData, groupShare):
    
    # Find data for party meats from sankeyData
    partyMeats = -1
    for data in sankeyData:
        if data[0]=="Hirvi" and data[1]=="Seurueelle":
            partyMeats=data[2]
            break

    if partyMeats == -1:
        return "Party data not found"

    # Find break point for group data in sankeyData
    i = 0
    for data in sankeyData:
        if data[0] == "Seurueelle":
            break
        i += 1

    # groupname : { share, expectedvalue, color}
    # Form groups dictionary and sum shares from sankeyData
    groups = {}
    totalShare = 0

    for group in groupShare:
        if group[2] != 0 and group[2] != None:
            totalShare += group[2]

    for group in groupShare:
        if group[2] != 0 and group[2] != None:
            groups[group[0]] = {
              "share": group[2],
              "expected meats": partyMeats*group[2]/totalShare,
            }
           
    # Generate target colors
    targetColors = []
    for j in range(0, len(sankeyData)): # TODO: Use sankeyData instead of range?
        if j<i:
            color = 10 + i*5
            targetColors.append(f"rgb(0, 0, {color})")
        else:
            group = groups[sankeyData[j][1]]
            groupMeatDelta = group["expected meats"] - sankeyData[j][2]
            relativeGroupMeatDelta = groupMeatDelta/group["expected meats"]

            if relativeGroupMeatDelta > 0 :
                red = 255 - 255*relativeGroupMeatDelta
                red = max(red, 0)
                targetColors.append(f"rgb({red},255,0)")
                continue
            elif relativeGroupMeatDelta <= 0:
                green = 255 + 255*relativeGroupMeatDelta
                green = max(green, 0)
                targetColors.append(f"rgb(255,{green},0)")

    print(targetColors)          
    return targetColors