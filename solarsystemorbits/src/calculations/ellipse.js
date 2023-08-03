
export function ellipseEquation(aphelion, perihelion, e, theta) {
    const a = (aphelion + perihelion)/200
    const differenceOfTwoSquares = 1 - Math.pow(e, 2)
    const numerator = a * differenceOfTwoSquares

    const cosExpression = e * Math.cos(theta)
    const denominator = 1 - cosExpression

    const radius = numerator / denominator

    return radius
}
