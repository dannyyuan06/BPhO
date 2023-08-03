from matplotlib import pyplot as plt
import json
import numpy as np
import math

FILE = "/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/planets.json"

with open(FILE) as json_file: DATA:dict = json.load(json_file)

OBJECTS = DATA.values()

# I could only get the apherlion, perihelion and eccentricity online
def ELLIPSE_EQUATION(APHELION, PERIHELION, E, THETA) -> float :
    AU_CONVERSION = 149.597870700
    A = (APHELION + PERIHELION) * AU_CONVERSION
    
    DIFFERENCE_OF_TWO_SQUARES = 1 - E ** 2
    
    # B is not needed as we have the eccentricity already
    B = A * DIFFERENCE_OF_TWO_SQUARES
    
    NUMERATOR = A * DIFFERENCE_OF_TWO_SQUARES

    COS_EXPRESSION = E * math.cos(THETA)
    DENOMINATOR = 1 - COS_EXPRESSION

    RADIUS = NUMERATOR / DENOMINATOR

    return RADIUS

def PARAMETRIC_CONVERSION(RADIUS, THETA) -> (float, float) :
    X = math.cos(THETA) * RADIUS
    Y = math.sin(THETA) * RADIUS
    return [X, Y]

plt.figure(figsize=(6,5))
AX = plt.subplot(111)
BOX = AX.get_position()
AX.set_position([BOX.x0, BOX.y0, BOX.width * 0.8, BOX.height])

# With finding the radius
for OBJECT in OBJECTS:
    PLANET_NAME = OBJECT["object"]
    APHELION = OBJECT["aphelion10_6Km"]
    PERIHELION = OBJECT["perihelion10_6Km"]
    ECCENTRICITY = OBJECT["orbitEccentricity"]
    THETA = np.linspace(0, 2 * math.pi, 1000)
    COORDS = map(lambda THETA: PARAMETRIC_CONVERSION(ELLIPSE_EQUATION(APHELION, PERIHELION, ECCENTRICITY, THETA), THETA), THETA)
    CORRDS_FLIPPED = [list(ROW) for ROW in zip(*COORDS)]
    
    AX.plot(CORRDS_FLIPPED[0], CORRDS_FLIPPED[1], label=PLANET_NAME)

AX.legend(loc='upper left', bbox_to_anchor=(1, 1))
plt.show()
    
