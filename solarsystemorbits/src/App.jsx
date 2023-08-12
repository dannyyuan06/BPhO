import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Menu } from './components/Menu';
import { CanvasWrapper } from './components/Canvas';
import json from './calculations/allPlanets.json'

export var speedRamp = 1
export var speedRampUpSpeed = 12
export var hasSpeedRamp = false
export var sampleFrequencySpirograph = 100
export var timerSpirograph = 10
export var data = json

var previousSpeed = 1

const defaultSettings = {
  speed: 10,
  sampleFrequency: 5,
  timer: 30 
}

function App() {
  
  const [isSpirograph, setIsSpirograph] = useState(false)
  const [planetSettings, setPlanetSettings] = useState(defaultSettings)
  const [twoPlanets, setTwoPlanets] = useState([])
  const [clearSpiro, setClearSpiro] = useState(false)
  const [solarSystem, setSolarSystem] = useState("Sun")
  const [centerObject, setCenterObject] = useState(solarSystem)
  const [hideMenu, setHideMenu] = useState(false)
  const [objectSize, setObjectSize] = useState(100)
  const [starSize, setStarSize] = useState(1)
  const [lightIntensity, setLightIntensity] = useState(1)

  useEffect(() => {
    setCenterObject(solarSystem)
  }, [solarSystem])

  const planetsA = Object.keys(data[solarSystem])
  let obj = {}

  for (let i=0;i<planetsA.length;i++) {
    obj[planetsA[i]] = false
  }

  const [isHidden, setIsHidden] = useState(obj)

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
      {hideMenu && <button className='menu-button' onClick={() => setHideMenu(prev => !prev)}>≡</button>}
      {!hideMenu && <div className="Settings">
        <div className="Inside-Scroll">
          <h1 className="Settings-Title">
            Menu
            <button className='Settings-Cross' onClick={() => setHideMenu(prev => !prev)}>
              ✕
            </button>
          </h1>
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
            solarSystem={solarSystem}
            setSolarSystem={setSolarSystem}
            starSize={starSize}
            objectSize={objectSize}
            setStarSize={setStarSize}
            setObjectSize={setObjectSize}
            setLightIntensity={setLightIntensity}
            lightIntensity={lightIntensity}
          />
        </div>
      </div>}
      <div className='Graph'>
        <CanvasWrapper
          key={centerObject}
          planetData={isHidden}
          isSpirograph={isSpirograph}
          clearSpiro={clearSpiro}
          centerObject={centerObject}
          solarSystem={solarSystem}
          objectSize={objectSize}
          starSize={starSize}
          lightIntensity={lightIntensity}
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