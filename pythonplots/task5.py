from matplotlib import pyplot as plt
import numpy as np
import math


# I quite like the algorithm which I have coded here

def TIME_VS_ORBIT(P, E, THETA_0, H):
    ANGLES = np.linspace(THETA_0, 6 * math.pi, round(6 * math.pi/H))
    CHANGE_OVER_THREE = H / 3
    # Each term is multiplied by this
    CONSTANT = (P * (1 - E ** 2) ** (3/2) / (2 * math.pi)) * CHANGE_OVER_THREE

    # Get the Y values from the angles and the equation
    YS = 1 / ((1 - E * np.cos(ANGLES)) ** 2)
    
    # Accumulated values of time
    time = [CONSTANT*(YS[0]+YS[1])]
    # Accumulator
    previous_term = CONSTANT * YS[0]
    for i, Y in enumerate(YS):
        if i == 0: continue
        if i == len(YS) - 1 :
            time.append(previous_term + CONSTANT*Y)
            break
        COEFFICIANT = 4 if i % 2 == 0 else 2
        CURRENT_TERM = previous_term + CONSTANT*COEFFICIANT*Y
        time.append(CURRENT_TERM)
        previous_term = CURRENT_TERM
    return time, ANGLES



# Init with Plutos parameters
TIME_A, ORBIT_A = TIME_VS_ORBIT(248.348, 0.25, 0, 0.001)
TIME_B, ORBIT_B = TIME_VS_ORBIT(248.348, 0, 0, 0.001)

FIG, AXS = plt.subplots()

AXS.set_xlabel("time /yrs")
AXS.set_ylabel("orbit polar angle /rad")
AXS.plot(TIME_A, ORBIT_A, label="actual eccentricity")
AXS.plot(TIME_B, ORBIT_B, label="circular")
AXS.grid(True)
AXS.legend()
plt.show()