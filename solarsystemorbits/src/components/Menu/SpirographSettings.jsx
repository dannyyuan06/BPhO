import { useState } from "react";
import { changeSampleFrequencySpirograph, changeSpeedRampSpeed, changeTimerSpirograph, sampleFrequencySpirograph, speedRampUpSpeed, timerSpirograph } from "../../App";
import { ExtraInfo } from "./ExtraInfo";

export function SpirographSettings() {

    const speedChange = (e) => {
        const stringSpeed = e.target.value;
        const intSpeed = parseInt(stringSpeed)
        if (isNaN(intSpeed)) changeSpeedRampSpeed(0);
        else {
            if (intSpeed > 200) {
                changeSpeedRampSpeed(200)
                e.target.value='200'
            } 
            else {
                changeSpeedRampSpeed(intSpeed)
            }
        }
    }

    return (
        <form className='spirograph-settings-form'>
            <div className="spirograph-setting">
                <label htmlFor="spiro-speed">
                    <ExtraInfo title="Object Speeds">
                        1 month in orbit per second
                    </ExtraInfo>
                </label>
                <input 
                    type="number" 
                    id="spiro-speed" 
                    name="spiro-speed" 
                    min='1' 
                    max='200'
                    step='1'
                    defaultValue={speedRampUpSpeed}
                    onChange={speedChange}/>
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="samplefrequency">
                    <ExtraInfo title="Sample Time Period">
                        Time is per calculated frame
                    </ExtraInfo>
                </label>
                <input
                    type="number"
                    id="samplefrequency"
                    name="samplefrequency"
                    min='10'
                    max='1000'
                    step='10'
                    defaultValue={sampleFrequencySpirograph}
                    onChange={e => {changeSampleFrequencySpirograph(parseFloat(e.target.value))}}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
            <div className="spirograph-setting">
                <label htmlFor="orbits">
                    <ExtraInfo title="Orbits of outer object">
                        How many times the outer object orbits the star.
                    </ExtraInfo>
                </label>
                <input 
                    type="number"
                    id="orbits"
                    name="orbits"
                    min='1'
                    max='20'
                    step='1'
                    defaultValue={timerSpirograph}
                    onChange={e => {changeTimerSpirograph(parseFloat(e.target.value))}}
                />
            </div>
            <hr style={{margin: 0}} color='#444e54'/>
        </form>
    )
}