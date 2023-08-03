from matplotlib import pyplot as plt
from scipy.stats import linregress
import json
import numpy as np

FILE = "/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/planets.json"

with open(FILE) as json_file: DATA:dict = json.load(json_file)

OBJECT = DATA.values()

ORBITAL_PERIOD_PER_YR = list(map(lambda PLANET: PLANET["orbitalPeriod"], OBJECT))
DISTANCE_FROM_SUN_IN_AU = list(map(lambda PLANET: PLANET["distanceFromSun"], OBJECT))
DISTANCE_FROM_SUN_IN_AU_TO_POWER = list(map(lambda DISTANCE: DISTANCE ** (3/2), DISTANCE_FROM_SUN_IN_AU))

X = DISTANCE_FROM_SUN_IN_AU_TO_POWER
Y = ORBITAL_PERIOD_PER_YR

X_VECTOR = np.array(X)

SLOPE, INTERCEPT, R_VALUE, P_VALUE, STD_ERR = linregress(X, Y)
REGRESSION_LINE = SLOPE * X_VECTOR + INTERCEPT
R_SQUARED_VALUE = R_VALUE ** 2

FIG, AXS = plt.subplots(1, 2, figsize=(10, 4))

FIG.suptitle("Kepler's laws")

AXS[0].scatter(X, Y, label="Plots")
AXS[0].plot(X, REGRESSION_LINE, color='r', label='Line')
AXS[0].set_xlabel("(a/AU)^(3/2)")
AXS[0].set_ylabel("T/Yr")
AXS[0].legend()

AXS[1].plot(DISTANCE_FROM_SUN_IN_AU, Y)
AXS[1].set_xlabel("(a/AU)")
AXS[1].set_ylabel("T/Yr")

plt.show()