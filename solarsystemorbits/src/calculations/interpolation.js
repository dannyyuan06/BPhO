export function interpolate(xValues, fValues, x) {
    // Find the index of the interval containing the target x value
    let index = binarySearch(xValues, x);
    
    // Make sure the index is within valid range
    if (index === 0) {
        index = 1;
    } else if (index === xValues.length) {
        index = xValues.length - 1;
    }
    
    // Calculate the weights for interpolation
    const x0 = xValues[index - 1];
    const x1 = xValues[index];
    const weight = (x - x0) / (x1 - x0);
    
    // Perform linear interpolation
    const fX0 = fValues[index - 1];
    const fX1 = fValues[index];
    const interpolatedF = fX0 + weight * (fX1 - fX0);
    
    return interpolatedF;
}

function binarySearch(arr, x) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === x) {
            return mid;
        } else if (arr[mid] < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
}