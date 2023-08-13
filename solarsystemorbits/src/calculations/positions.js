import { data } from "../App";
import { ellipseEquation } from "./ellipse";
import { interpolate } from "./interpolation";
import { timeVsOrbit } from "./timeVsOrbit";

export function calculatePositions(centerObject, buffer, interval, solarSystem, sun) {
    let positions = []
    let nextBuffer = {}
    const objects = Object.values(data[solarSystem])

    const tVsO = calculateTimeVsOrbit(solarSystem)

    for (let i=0;i<1000;i++) {
        let sunCoords = [0,0,0]
        let frame = []
        for (let j=0;j<objects.length;j++) {
            if (centerObject === sun && j === 0){
                if (i === 999) nextBuffer[centerObject] = 0
                frame.push([0,0,0])
                sunCoords = [0, 0, 0]
            }
            else {
                const object = j === 0 ? data[solarSystem][centerObject] : objects[j]
                const time = (i*interval + buffer[object.object])%tVsO[object.object][0][tVsO[object.object][0].length-1];
                const angleTurned = interpolate(tVsO[object.object][0], tVsO[object.object][1], time)
                const radius = ellipseEquation(object.a, object.e, angleTurned)
                const inclination = object.angle/180*Math.PI
                const x = Math.cos(angleTurned) * radius * Math.cos(inclination) + sunCoords[0]
                const y = Math.sin(angleTurned) * radius + sunCoords[1]
                const z = Math.cos(angleTurned) * radius * -Math.sin(inclination) + sunCoords[2]
                let pos = [x, y, z]
                if (j === 0) {
                    sunCoords = [-x, -y, -z]
                    pos = sunCoords
                }
                frame.push(pos)
                if (i === 999) {
                    nextBuffer[object.object] = (i*interval + buffer[object.object])% tVsO[object.object][0][tVsO[object.object][0].length-1]
                }
            }
        }
        positions.push(frame)
    }
    return [positions, nextBuffer]
}

function calculateTimeVsOrbit(solarSystem) {

    const objects = Object.values(data[solarSystem])
    let timeVsOrbitLoad = {}
    for (let i=0;i<objects.length;i++) {
        const object = objects[i]
        const {orbitalPeriod, e, a } = object
        timeVsOrbitLoad[object.object] = timeVsOrbit(orbitalPeriod, e, 0, 0.01)
    }
    return timeVsOrbitLoad
}