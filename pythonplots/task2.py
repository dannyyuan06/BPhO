from matplotlib import pyplot as plt
import json
import numpy as np
import math

FILE = "/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/planets.json"

with open(FILE) as json_file: DATA:dict = json.load(json_file)

OBJECTS = list(DATA.values())

# I could only get the apherlion, perihelion and eccentricity online
# This just follows the equation provided on the side.
def ELLIPSE_EQUATION(A, E, THETA) -> float :
    
    DIFFERENCE_OF_TWO_SQUARES = 1 - E ** 2
    
    # B is not needed as we have the eccentricity already
    B = A * DIFFERENCE_OF_TWO_SQUARES
    
    NUMERATOR = A * DIFFERENCE_OF_TWO_SQUARES

    COS_EXPRESSION = E * math.cos(THETA)
    DENOMINATOR = 1 - COS_EXPRESSION

    RADIUS = NUMERATOR / DENOMINATOR

    return RADIUS

def PARAMETRIC_CONVERSION(RADIUS, THETA) -> list[float] :
    X = math.cos(THETA) * RADIUS
    Y = math.sin(THETA) * RADIUS
    return [X, Y]


FIG, AXS = plt.subplots(1, 2, figsize=(10.5, 5))
FIG.suptitle("Orbits")

# With finding the radius
for i in range(len(OBJECTS)):
    OBJECT = OBJECTS[i]
    PLANET_NAME = OBJECT["object"]
    A = OBJECT["a"]
    ECCENTRICITY = OBJECT["e"]
    THETA = np.linspace(0, 2 * math.pi, 1000)
    # Functional programing - I like to use it to reduce code
    # loop through all angles to get the coordinates
    COORDS = map(lambda THETA: PARAMETRIC_CONVERSION(ELLIPSE_EQUATION(A, ECCENTRICITY, THETA), THETA), THETA)
    CORRDS_FLIPPED = [list(ROW) for ROW in zip(*COORDS)]
    # Plot two different graphs
    AXS[0].plot(CORRDS_FLIPPED[0], CORRDS_FLIPPED[1], label=PLANET_NAME)
    if (i <= 3): AXS[1].plot(CORRDS_FLIPPED[0], CORRDS_FLIPPED[1], label=PLANET_NAME)

# AXS.legend(loc='upper left', bbox_to_anchor=(1, 1))
AXS[0].grid(True)
AXS[1].grid(True)
plt.show()
    
