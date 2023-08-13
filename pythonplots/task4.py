from matplotlib import pyplot as plt
from matplotlib.animation import FuncAnimation
import json
import numpy as np
import math


plt.ioff()
# matplotlib.use('Agg')

FILE = "/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/planets.json"

with open(FILE) as json_file: DATA:dict = json.load(json_file)

OBJECTS = list(DATA.values())
INNER_OBJECTS = OBJECTS[:4]
OUTER_OBJECTS = OBJECTS[4:]

# Attempt at using matplotlib to plot 3D animation which was pretty laggy. You need to exit via the terminal
# All of this is essentially the same as the lasy challenge only difference is on lines 77 - 79

def ELLIPSE_EQUATION(A, E, THETA) -> float :
    DIFFERENCE_OF_TWO_SQUARES = 1 - E ** 2
    
    # B is not needed as we have the eccentricity already
    B = A * DIFFERENCE_OF_TWO_SQUARES
    
    NUMERATOR = A * DIFFERENCE_OF_TWO_SQUARES

    COS_EXPRESSION = E * math.cos(THETA)
    DENOMINATOR = 1 - COS_EXPRESSION

    RADIUS = NUMERATOR / DENOMINATOR

    return RADIUS

def PARAMETRIC_CONVERSION(RADIUS, THETA, ANGLE_OF_INCLINATION) -> list[float] :
    X = math.cos(THETA) * RADIUS * math.cos(ANGLE_OF_INCLINATION)
    Y = math.sin(THETA) * RADIUS
    Z = math.cos(THETA) * RADIUS * math.sin(ANGLE_OF_INCLINATION)
    return [X, Y, Z]

def CREATE_ORBITS(OBJECTS, AXS) :
    AXS.scatter(0,0,0, c="yellow", marker='o')
    for i in range(len(OBJECTS)):
        OBJECT = OBJECTS[i]
        PLANET_NAME = OBJECT["object"]
        A = OBJECT["a"]
        INCLINATION = OBJECT["angle"] / 180 * math.pi
        ECCENTRICITY = OBJECT["e"]
        THETA = np.linspace(0, 2 * math.pi, 1000)
        COORDS = map(lambda THETA: PARAMETRIC_CONVERSION(ELLIPSE_EQUATION(A, ECCENTRICITY, THETA), THETA, INCLINATION), THETA)
        CORRDS_FLIPPED = [list(ROW) for ROW in zip(*COORDS)]
        
        AXS.plot(CORRDS_FLIPPED[0], CORRDS_FLIPPED[1], CORRDS_FLIPPED[2], label=PLANET_NAME)


def ANIMATE_OBJECTS(OBJECTS, NUMBER_OF_EARTH_ORBITS_PER_YEAR, FRAME_SIZE, AXS, FIG) :
    LNS = [AXS.scatter([0], [0], [0], c='red')]
    def init() :
        AXS.set_xlim(-FRAME_SIZE[0], FRAME_SIZE[0])
        AXS.set_ylim(-FRAME_SIZE[1], FRAME_SIZE[1])
        AXS.set_zlim(-FRAME_SIZE[2], FRAME_SIZE[2])
        return LNS

    def update(frame) :
        linest = [[] ,[] ,[]]
        for i, OBJECT in enumerate(OBJECTS):
            A = OBJECT["a"]
            ECCENTRICITY = OBJECT["e"]
            THETA = 2 * math.pi * (frame/30) * NUMBER_OF_EARTH_ORBITS_PER_YEAR / OBJECT["orbitalPeriod"]
            INCLINATION = OBJECT["angle"] / 180 * math.pi
            RADIUS = ELLIPSE_EQUATION(A, ECCENTRICITY, THETA)
            # Changed the logic to account for 3D space
            X = RADIUS * math.cos(THETA) * math.cos(INCLINATION)
            Y = RADIUS * math.sin(THETA)
            Z = RADIUS * math.cos(THETA) * math.sin(INCLINATION)
            linest[0].append(X)
            linest[1].append(Y)
            linest[2].append(Z)
        LNS[0]._offsets3d = (linest[0], linest[1], linest[2])
        return LNS
    AXS.legend()
    FRAME_RATE = 30
    INTERVAL = 1000 / FRAME_RATE
    for i in range(10000):
        init()
        update(i)
        plt.pause(INTERVAL/1000)
    plt.show()
   
def START_ANIMATION(PLANETS) :
    if PLANETS == "inner" :
        FIG = plt.figure()
        AXS = plt.axes(projection='3d')
        # FIG, AXS = plt.subplots(figsize=(5, 5), subplot_kw={'projection': '3d'})
        FIG.suptitle("Inner orbits")
        CREATE_ORBITS(INNER_OBJECTS, AXS)
        ANIMATE_OBJECTS(INNER_OBJECTS, 1, [2, 2, 2], AXS, FIG)
        AXS.grid(True)
    else :
        FIG = plt.figure()
        AXS = plt.axes(projection='3d')
        FIG.suptitle("Outer orbits")
        CREATE_ORBITS(OUTER_OBJECTS, AXS)
        ANIMATE_OBJECTS(OUTER_OBJECTS, DATA["jupiter"]["orbitalPeriod"], [60, 60, 60], AXS, FIG)
        AXS.grid(True)

START_ANIMATION("outer")