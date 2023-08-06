import { changeSpeedRamp, data, speedRamp } from "../../App";

export function PlanetSettings({setCenterObject, centerObject}) {
    const planets = Object.keys(data)
    console.log(planets)
    return (
        <form className='spirograph-settings-form'>
            <div className="spirograph-setting">
                <label htmlFor="speed">
                    <h3>Planet Speeds</h3>
                </label>
                <input 
                    type="number" 
                    id="speed" 
                    name="speed" 
                    min='0' 
                    max='100' 
                    step='1'
                    defaultValue={speedRamp}
                    onChange={e => { isNaN(parseFloat(e.target.value)) ? 0 : changeSpeedRamp(parseFloat(e.target.value))}}
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
        </form>
    )
}