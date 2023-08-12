import { useEffect, useRef, useState } from "react";
import { changeSpeedRamp, data, speedRamp } from "../../App";
import { ExtraInfo } from "./ExtraInfo";

export function PlanetSettings({
    setCenterObject,
    centerObject,
    solarSystem,
    setSolarSystem,
    setObjectSize,
    setStarSize,
    starSize,
    objectSize,
    setLightIntensity,
    lightIntensity
}) {
    const planets = Object.keys(data[solarSystem])
    const stars = Object.keys(data)


    const speedChange = (e) => {
        const stringSpeed = e.target.value;
        const intSpeed = parseInt(stringSpeed)
        if (isNaN(intSpeed)) changeSpeedRamp(0);
        else {
            if (intSpeed > 200) {
                changeSpeedRamp(200)
                e.target.value='200'
            } 
            else {
                changeSpeedRamp(intSpeed)
            }
        }
    }
    return (
        <form className='spirograph-settings-form'>
            <div className="spirograph-setting">
                <label htmlFor="speed">
                    <ExtraInfo title="Object Speeds">
                        1 month in orbit per second
                    </ExtraInfo>
                </label>
                <input 
                    type="number" 
                    id="speed" 
                    name="speed" 
                    min='0' 
                    max='100' 
                    step='1'
                    defaultValue={speedRamp}
                    onChange={speedChange}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="size">
                    <ExtraInfo title="Object Size">
                        Two thousanth of the distance from the Earth to the sun
                    </ExtraInfo>
                </label>
                <input 
                    type="number"
                    id="size"
                    name="size"
                    min='0.01'
                    max='1000'
                    step='1'
                    value={objectSize}
                    onChange={e => { isNaN(parseFloat(e.target.value)) ? setObjectSize(0) : setObjectSize(parseFloat(e.target.value)) }}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="star-size">
                    <ExtraInfo title="Star Size">
                        Two thousanth of the distance from the Earth to the sun
                    </ExtraInfo>
                </label>
                <input 
                    type="number"
                    id="star-size"
                    name="star-size"
                    min='0.01'
                    max='1000'
                    step='1'
                    value={starSize}
                    onChange={e => { isNaN(parseFloat(e.target.value)) ? setStarSize(0) : setStarSize(parseFloat(e.target.value)) }}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="light-intensity">
                    <h3>Sun Brightness</h3>
                </label>
                <input 
                    type="number"
                    id="light-intensity"
                    name="light-intensity"
                    min='0'
                    max='10'
                    step='1'
                    value={lightIntensity}
                    onChange={e => { isNaN(parseFloat(e.target.value)) ? setLightIntensity(0) : setLightIntensity(parseFloat(e.target.value)) }}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="centerPlanet">
                    <h3>Centre Object</h3>
                </label>
                <select name="centerPlanet" value={centerObject} onChange={(e) => setCenterObject(e.target.value)}>
                    {planets.map(planet => (
                        <option key={planet} value={planet}>{planet[0].toUpperCase() + planet.slice(1)}</option>
                    ))}
                </select>
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="star">
                    <h3>Star</h3>
                </label>
                <SearchPlanets stars={stars} setSolarSystem={setSolarSystem} solarSystem={solarSystem}/>
            </div>
        </form>
    )
}



function SearchPlanets({stars, setSolarSystem, solarSystem}) {

    const [dropdown, setDropdown] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.value = solarSystem
    }, [])

    const changeHandler = (e) => {
        const text = e.target.value;

        let objects = []
        let i = 0
        while (objects.length < 10 && i < stars.length) {
            const star = stars[i]
            if (star.toLowerCase().includes(text.toLowerCase())) {
                const regex = new RegExp(text, 'i')
                const [first, ...rest] = star.split(regex)
                const [found] = star.match(regex)
                const remainder = rest.join(text)
                const buttonClickedHandler = () => {
                    e.target.value = star;
                    setSolarSystem(star)
                    setDropdown(null)
                }
                objects.push(
                    <div key={i} className="dropdown-button" onClick={buttonClickedHandler} onMouseDown={e => {e.preventDefault()}} >
                        {first}<span style={{fontWeight: 'bold'}}>{found}</span>{remainder}
                    </div>
                )
            }
            i++
        }
        setDropdown(objects)
    }

    return (
        <div className="dropdown-container">
            <div className="search-planets" onBlur={() => setDropdown(null)}>
                <input type="search" name="star" onChange={changeHandler} ref={inputRef}/>
                <div className="search-dropdown">
                    {dropdown}
                </div>
            </div>
        </div>
    )
}