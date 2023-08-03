import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Menu } from './components/Menu';
import { CanvasWrapper } from './components/Canvas';
import json from './calculations/planets.json'

export var speedRamp = 0.3
export var speedRampUpSpeed = 10
export var sampleFrequencySpirograph = 5
export var timerSpirograph = 30
export var data = json


const planetsA = Object.keys(data)
let obj = {}

for (let i=0;i<planetsA.length;i++) {
  obj[planetsA[i]] = false
}

const defaultSettings = {
  speed: 10,
  sampleFrequency: 5,
  timer: 30 
}

function App() {
  
  const [isHidden, setIsHidden] = useState(obj)
  const [isSpirograph, setIsSpirograph] = useState(false)
  const [planetSettings, setPlanetSettings] = useState(defaultSettings)
  const [twoPlanets, setTwoPlanets] = useState([])
  const [clearSpiro, setClearSpiro] = useState(false)

  return (
    <div className="App">
      <div className="Settings">
        <div className="Inside-Scroll">
          <h1 className="Settings-Title">Menu</h1>
          <Menu
            setIsHidden={setIsHidden}
            isHidden={isHidden}
            setIsSpirograph={setIsSpirograph}
            isSpirograph={isSpirograph}
            planetSettings={planetSettings}
            setPlanetSettings={setPlanetSettings}
            setTwoPlanets={setTwoPlanets}
            twoPlanets={twoPlanets}
            setClearSpiro={setClearSpiro}
          />
        </div>
      </div>
      <div className='Graph'>
        <CanvasWrapper planetData={isHidden} isSpirograph={isSpirograph} clearSpiro={clearSpiro}/>
      </div>
    </div>
  )
}

export default App


export function speedRampUp() {
  speedRamp = speedRampUpSpeed
}

export function speedRampDown() {
  speedRamp = 0.3
}

export function changeSpeedRampSpeed(speed) {
  speedRampUpSpeed = speed
}

export function changeSampleFrequencySpirograph(freq) {
  sampleFrequencySpirograph = freq
}

export function changeTimerSpirograph(time) { 
  timerSpirograph = time
}