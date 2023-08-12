from matplotlib import pyplot as plt
from matplotlib.animation import FuncAnimation
import json
import numpy as np
import math
import itertools

FILE = "/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/planets.json"

with open(FILE) as json_file: DATA:dict = json.load(json_file)

OBJECTS = list(DATA.values())
INNER_OBJECTS = OBJECTS[:4]
OUTER_OBJECTS = OBJECTS[4:]

# All of the same code following the last challenges
# This method is assuming orbit angle vs time is linear
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

def CREATE_ORBITS(OBJECTS, AXS) :
    AXS.plot(0,0, 'o', color='y')
    for i in range(len(OBJECTS)):
        OBJECT = OBJECTS[i]
        PLANET_NAME = OBJECT["object"]
        A = OBJECT["a"]
        ECCENTRICITY = OBJECT["e"]
        THETA = np.linspace(0, 2 * math.pi, 1000)
        COORDS = map(lambda THETA: PARAMETRIC_CONVERSION(ELLIPSE_EQUATION(A, ECCENTRICITY, THETA), THETA), THETA)
        CORRDS_FLIPPED = [list(ROW) for ROW in zip(*COORDS)]
        
        AXS.plot(CORRDS_FLIPPED[0], CORRDS_FLIPPED[1], label=PLANET_NAME)


def ANIMATE_OBJECTS(OBJECTS, NUMBER_OF_EARTH_ORBITS_PER_YEAR, FRAME_SIZE, AXS, FIG) :
    LNS = [plt.plot(0, 0, "o")[0] for _ in OBJECTS]
    # Initalises the Axis
    def init() :
        AXS.set_xlim(-FRAME_SIZE[0], FRAME_SIZE[0])
        AXS.set_ylim(-FRAME_SIZE[1], FRAME_SIZE[1])
        return LNS
    # Runs each frame
    def update(frame) :
        for i, OBJECT in enumerate(OBJECTS):
            A = OBJECT["a"]
            ECCENTRICITY = OBJECT["e"]
            THETA = 2 * math.pi * (frame/30) * NUMBER_OF_EARTH_ORBITS_PER_YEAR / OBJECT["orbitalPeriod"]
            RADIUS = ELLIPSE_EQUATION(A, ECCENTRICITY, THETA)
            X = RADIUS * math.cos(THETA)
            Y = RADIUS * math.sin(THETA)
            LNS[i].set_data([X], [Y])
        return LNS
    # Set animation parameters
    AXS.legend()
    FRAME_RATE = 30
    INTERVAL = 1000 / FRAME_RATE
    FRAME_GENERATOR = itertools.count()
    ANIMATION = FuncAnimation(FIG, update, frames=FRAME_GENERATOR, init_func=init, blit=True, interval=INTERVAL, cache_frame_data=False)
    plt.show()
   
# Logic for the inner planets and outer planets
def START_ANIMATION(PLANETS) :
    if PLANETS == "inner" :
        FIG, AXS = plt.subplots(figsize=(5, 5))
        FIG.suptitle("Inner orbits")
        CREATE_ORBITS(INNER_OBJECTS, AXS)
        ANIMATE_OBJECTS(INNER_OBJECTS, 1, [2, 2], AXS, FIG)
        AXS.grid(True)
    else :
        FIG, AXS = plt.subplots(figsize=(6, 4))
        FIG.suptitle("Outer orbits")
        CREATE_ORBITS(OUTER_OBJECTS, AXS)
        ANIMATE_OBJECTS(OUTER_OBJECTS, DATA["jupiter"]["orbitalPeriod"], [60, 40], AXS, FIG)
        AXS.grid(True)

START_ANIMATION("inner")