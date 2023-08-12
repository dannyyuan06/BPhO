import { linespace } from "./linespace";

export function timeVsOrbit(p, e, theta0, h){
    const angles = linespace(theta0, 4 * Math.PI, Math.round(4 * Math.PI/h))
    const changeOverThree = h / 3
    const constant = (p * (1 - e ** 2) ** (3/2) / (2 * Math.PI)) * changeOverThree

    const ys = angles.map(angle => 1 / ((1 - e * Math.cos(angle)) ** 2))
    let time = [constant*(ys[0]+ys[1])]
    let previousTerm = constant * ys[0]
    for (let i=0;i<ys.length;i++) {
        const y = ys[i]
        if (i == 0) continue
        if (i == ys.length - 1) {
            time.push(previousTerm + constant*y)
            break
        }
        const coefficiant = i % 2 == 0 ? 4 : 2
        const currentTerm = previousTerm + constant*coefficiant*y
        time.push(currentTerm)
        previousTerm = currentTerm
    }
        
    return [time, angles]
}