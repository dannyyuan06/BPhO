import './styles.css'
import { 
    data,
    speedRampUp,
    speedRampDown,
    changeSpeedRampSpeed,
    changeSampleFrequencySpirograph,
    changeTimerSpirograph,
    timerSpirograph,
    speedRamp,
    speedRampUpSpeed,
} from "../../App";
import { useState } from 'react'
import { PlanetMenu } from './Planet';
import { SpirographSettings } from './SpirographSettings';
import { PlanetSettings } from './PlanetSettings';


let timeout = null

export function Menu({
    isHidden,
    setIsHidden,
    setIsSpirograph,
    isSpirograph,
    setPlanetSettings,
    planetSettings,
    setTwoPlanets,
    twoPlanets,
    setClearSpiro,
    setCenterObject,
    centerObject,
    solarSystem,
    setSolarSystem,
    starSize,
    objectSize,
    setObjectSize,
    setStarSize,
    setLightIntensity,
    lightIntensity
}) {
    
    const planets = Object.keys(data[solarSystem])

    const clearClickHandler = () => {
        setClearSpiro(prev => !prev)
    }

    const clickHandler = () => {
        setIsSpirograph(true)
        let obj = {}
        for (let i=0;i<planets.length;i++) {
            obj[planets[i]] = !twoPlanets.includes(planets[i])
        }
        const outerPlanetTimePeriod = Math.max(data[solarSystem][twoPlanets[0]]["orbitalPeriod"], data[solarSystem][twoPlanets[1]]["orbitalPeriod"])
        setIsHidden(obj)
        speedRampUp()
        console.log(1000 * timerSpirograph * outerPlanetTimePeriod * 12 / speedRampUpSpeed)
        timeout = setTimeout(() => {
            speedRampDown()
            setIsSpirograph(false)
        }, 1000 * timerSpirograph * outerPlanetTimePeriod * 12 / speedRampUpSpeed);
    }

    const stopClickHandler = () => {
        speedRampDown()
        setIsSpirograph(false)
        clearTimeout(timeout)
    }

    return (
        <>
        <MenuSection name='Environment Settings'>
            <div className='menu-section'>
                <div className='menu-description'>Edit the spirograph settings below</div>
                <PlanetSettings
                    setCenterObject={setCenterObject}
                    centerObject={centerObject}
                    solarSystem={solarSystem}
                    setSolarSystem={setSolarSystem}
                    starSize={starSize}
                    objectSize={objectSize}
                    setObjectSize={setObjectSize}
                    setStarSize={setStarSize}
                    setLightIntensity={setLightIntensity}
                    lightIntensity={lightIntensity}
                />
            </div>
        </MenuSection>
        <MenuSection name='Planets/Objects'>
            <div className='menu-section'>
                <div className='menu-description'>Select two objects to make a spirograph</div>
                {planets.map((value) => (
                <div key={value}>
                    <PlanetMenu planet={value} setIsHidden={setIsHidden} isHidden={isHidden} setTwoPlanets={setTwoPlanets} twoPlanets={twoPlanets}/>
                    <hr style={{margin: 0}} color='#444e54'/>
                </div>
                ))}
                <div className='spirograph-buttons'>
                    <button className='spirograph-button' onClick={clearClickHandler}>
                        Clear Spirograph
                    </button>
                    <button className='spirograph-button'
                            onClick={!isSpirograph && twoPlanets.length === 2 ? clickHandler : stopClickHandler}
                            style={twoPlanets.length !== 2 ? {filter: 'saturate(0)', cursor: 'not-allowed'}: {}}
                    >
                        {!isSpirograph ? 'Make' : 'Stop'} Spirograph
                    </button>
                </div>
            </div>
        </MenuSection>

        <MenuSection name='Spirograph Settings'>
            <div className='menu-section'>
                <div className='menu-description'>Edit the spirograph settings below</div>
                <SpirographSettings/>
            </div>
        </MenuSection>
        </>
    )
}

function MenuSection({name, children}) {

    const [displayed, setDisplayed] = useState(true)

    return (
        <>
            <button className='menu-title' onClick={() => setDisplayed(displayed => !displayed)}>
                {name}
                <span style={{float: 'right'}}>{displayed ? '▾' : '▸'}</span>
            </button>
            {displayed && children}
        </>
    )
}



