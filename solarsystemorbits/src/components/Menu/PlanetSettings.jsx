import { changeSpeedRamp } from "../../App";

export function PlanetSettings() {
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
                    min='0.3' 
                    max='100' 
                    step='0.1'
                    defaultValue={1}
                    onChange={e => { isNaN(parseFloat(e.target.value)) ? 0 : changeSpeedRamp(parseFloat(e.target.value))}}/>
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
        </form>
    )
}