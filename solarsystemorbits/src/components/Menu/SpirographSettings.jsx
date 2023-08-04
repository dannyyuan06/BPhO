import { useState } from "react";
import { changeSampleFrequencySpirograph, changeSpeedRampSpeed, changeTimerSpirograph } from "../../App";

export function SpirographSettings() {

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
                    defaultValue={10}
                    onChange={e => {changeSpeedRampSpeed(parseFloat(e.target.value))}}/>
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="samplefrequency">
                    <h3>Sample Frequency</h3>
                </label>
                <input
                    type="number"
                    id="samplefrequency"
                    name="samplefrequency"
                    min='1'
                    max='10'
                    step='0.5'
                    defaultValue={5}
                    onChange={e => {changeSampleFrequencySpirograph(parseFloat(e.target.value))}}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="speed">
                    <h3>Timer</h3>
                </label>
                <input 
                    type="number"
                    id="speed"
                    name="speed"
                    min='5'
                    max='60'
                    step='5'
                    defaultValue={30}
                    onChange={e => {changeTimerSpirograph(parseFloat(e.target.value))}}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
        </form>
    )
}