import './styles.css'
import { 
    data,
    speedRampUp,
    speedRampDown,
    changeSpeedRampSpeed,
    changeSampleFrequencySpirograph,
    changeTimerSpirograph,
    timerSpirograph,
} from "../../App";
import { useState } from 'react'
import { PlanetMenu } from './Planet';
import { SpirographSettings } from './SpirographSettings';


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
}) {
    const [spirographMenu, setSpriographMenu] = useState(false)

    const planets = Object.keys(data)

    const clearClickHandler = () => {
        setClearSpiro(prev => !prev)
    }

    const clickHandler = () => {
        setIsSpirograph(true)
        let obj = {}
        for (let i=0;i<planets.length;i++) {
            obj[planets[i]] = !twoPlanets.includes(planets[i])
        }
        setIsHidden(obj)
        speedRampUp()
        timeout = setTimeout(() => {
            speedRampDown()
            setIsSpirograph(false)
        }, 1000 * timerSpirograph);
    }

    const stopClickHandler = () => {
        speedRampDown()
        setIsSpirograph(false)
        clearTimeout(timeout)
    }

    return (
        <>
        <div className='menu-title'>Planets</div>
        <div className='menu-description'>Select two planets to make a spirograph</div>
        <div className='menu-section'>
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
        <div className='menu-title'>Spirograph Settings</div>
        <div className='menu-description'>Edit the spirograph settings below</div>

         <SpirographSettings setSpriographMenu={setSpriographMenu}/>
        </>
    )
}




