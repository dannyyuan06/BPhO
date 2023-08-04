export function linespace(startValue, endValue, cardinality) {
    let arr = []
    const difference = (endValue - startValue) / (cardinality - 1)
    for (let i=0;i<cardinality;i++) {
        arr.push(startValue + difference * i)
    }
    return arr
}