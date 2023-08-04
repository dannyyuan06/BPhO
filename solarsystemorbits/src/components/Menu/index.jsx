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
}) {
    
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
        <MenuSection name='Environment Settings'>
            <div className='menu-section'>
                <div className='menu-description'>Edit the spirograph settings below</div>
                <PlanetSettings/>
            </div>
        </MenuSection>
        <MenuSection name='Planets'>
            <div className='menu-section'>
                <div className='menu-description'>Select two planets to make a spirograph</div>
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
        {/* <button className='menu-title' onClick={() => setMenus(menu => ({...menu, spirograph: !menu.spirograph}))}>Spirograph Settings</button>
        {menus.spirograph &&
            <div className='menu-section'>
                <div className='menu-description'>Edit the spirograph settings below</div>
                <SpirographSettings/>
            </div>
        } */}
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



