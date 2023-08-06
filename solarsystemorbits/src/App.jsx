import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Menu } from './components/Menu';
import { CanvasWrapper } from './components/Canvas';
import json from './calculations/planets.json'

export var speedRamp = 1
export var speedRampUpSpeed = 10
export var hasSpeedRamp = false
export var sampleFrequencySpirograph = 5
export var timerSpirograph = 30
export var data = json

var previousSpeed = 1

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
  const [centerObject, setCenterObject] = useState("sun")

  useEffect(() => {
    window.onblur = () => {
      previousSpeed = speedRamp
      speedRamp = 0
    }
    window.onfocus = () => {
      speedRamp = previousSpeed
    }
  }, [])

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
            setCenterObject={setCenterObject}
            centerObject={centerObject}
          />
        </div>
      </div>
      <div className='Graph'>
        <CanvasWrapper
          key={centerObject}
          planetData={isHidden}
          isSpirograph={isSpirograph}
          clearSpiro={clearSpiro}
          centerObject={centerObject}
        />
      </div>
    </div>
  )
}

export default App


export function speedRampUp() {
  hasSpeedRamp = true
  speedRamp = speedRampUpSpeed
}

export function speedRampDown() {
  hasSpeedRamp = false
  speedRamp = 0.3
}

export function changeSpeedRampSpeed(speed) {
  speedRampUpSpeed = speed
}

export function changeSpeedRamp(speed) {
  speedRamp = speed
}

export function changeSampleFrequencySpirograph(freq) {
  sampleFrequencySpirograph = freq
}

export function changeTimerSpirograph(time) { 
  timerSpirograph = time
}