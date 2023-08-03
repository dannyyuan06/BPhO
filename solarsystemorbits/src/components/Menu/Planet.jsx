export function PlanetMenu({planet, setIsHidden, isHidden, setTwoPlanets, twoPlanets}) {

    const isOutlined = twoPlanets.includes(planet)

    const selectClickHanlder = () => {
        console.log(twoPlanets);
        if (isOutlined) {
            const otherPlanet = twoPlanets.find(onePlanet => onePlanet !== planet)
            setTwoPlanets(otherPlanet ? [otherPlanet]: [])
        } else {
            setTwoPlanets(prev => prev.length < 2 ? [...prev, planet] : prev)
        }
    }

    const hiddenClickHandler = e => {
        e.stopPropagation()
        console.log(isHidden, planet);
        setIsHidden(prev => ({ ...prev, [planet]: !prev[planet]}))
    }

    return (
        <div className='planet-container' style={isOutlined ? {outline: '2px solid var(--theme-orange)'}: {}}>
            <button className='select-planet' onClick={selectClickHanlder}>
                <h3 className='planet-title'>{planet[0].toUpperCase() + planet.substring(1, planet.length)}</h3>
            </button>
            <div className='button-container'>
                <button className='eye-wrapper' onClick={hiddenClickHandler}>
                    <div className='eye-slash' style={{opacity: isHidden[planet] ? '1': ''}}></div>
                    <img className='eye-image' src='/eye.png'/>
                </button>
            </div>
        </div>
    )
}