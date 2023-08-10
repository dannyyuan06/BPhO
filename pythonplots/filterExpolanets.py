import csv
import json
import copy
import random

dictionary = {}
planetSchema = {
    "color": "#ffb44a",
    "object": "",
    "massEarthMasses": 0,
    "distanceFromSun": 1,
    "radiusInEarthRadii": 1,
    "rotationalPeriodDays": 0,
    "orbitalPeriod": 1,
    "gravitationalField": 0,
    "a": 1,
    "angle": 0,
    "e": 0
}

useful = {
    152: "object",
    132 : "massEarthMasses",
    46 : "distanceFromSun",
    175 : "radiusInEarthRadii",
    168 : "orbitalPeriod",
    91 : "gravitationalField",
    0: "a",
    101 : "angle",
    66 : "e",
}

# useful = {
#     1: "object",
#     132 : "massEarthMasses",
#     46 : "distanceFromSun",
#     175 : "radiusInEarthRadii",
#     168 : "orbitalPeriod",
#     91 : "gravitationalField",
#     0: "a",
#     101 : "angle",
#     66 : "e",
# }

with open('/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/exoplanets.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    counter = 0
    for row in csv_reader:
        planet = copy.deepcopy(planetSchema)
        flag = False
        if counter!=0:
            if row[272] not in dictionary: dictionary[row[272]] = {}
            dictionary[row[272]][row[272]] = {
                "color": "#" + ("%06x" % random.randint(0x222222, 0xFFFFFF)),
                "object": row[272],
                "massEarthMasses": float(row[145] if row[125] != '' else 0),
                "distanceFromSun": 0,
                "radiusInEarthRadii": float(row[197] if row[197] != '' else 0),
                "rotationalPeriodDays": 0,
                "orbitalPeriod": 0,
                "gravitationalField": float(row[126] if row[126] != '' else 0),
                "a": 0,
                "angle": 0,
                "e": 0
            }
            for key, value in useful.items():
                prop = row[key]
                if prop == '': continue
                number = float(prop) if key != 152 else prop
                planet[value] = number
            planet["color"] = "#" + ("%06x" % random.randint(0x222222, 0xFFFFFF))
            dictionary[row[272]][row[152]] = planet
        counter += 1

json_object = json.dumps(dictionary, indent=4)
with open("/Users/dannyyuan/Desktop/Code/Websites/BPhO/pythonplots/exoplanets.json", "w") as outfile:
    outfile.write(json_object)