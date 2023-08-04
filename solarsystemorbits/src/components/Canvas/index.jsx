import { CameraControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import { data, speedRamp, speedRampUpSpeed, sampleFrequencySpirograph, hasSpeedRamp } from "../../App"
import { ellipseEquation } from "../../calculations/ellipse";
import { BufferGeometry, EllipseCurve, Vector3 } from "three";
import { linespace } from "../../calculations/linespace";
import { timeVsOrbit } from "../../calculations/timeVsOrbit";
import { interpolate } from "../../calculations/interpolation";


var sunCoords = [0,0,0]

export function CanvasWrapper(props) {

  const [twoPositions, setTwoPositions] = useState([]) 

  useEffect(() => {
    if (!props.isSpirograph) {
      setTwoPositions([])
    }
  },[props.isSpirograph])

  return (
    <Canvas>
      <CameraControls/>
      {/* args={[0x404040]} */}
      <ambientLight/>
      <pointLight position={[0, 0, 0]} />
      <Sun
          position={[0, 0, 0]}
          sphereGeometry={[0.1, 20, 20]}
          centerObject={props.centerObject}
          clearSpiro={props.clearSpiro}
          isSpirograph={props.isSpirograph}
          twoPositions={twoPositions}
          hidden={true}
          setTwoPositions={setTwoPositions}
          clearSpiro={props.clearSpiro}
          centerObject={props.centerObject}
      />
      {Object.values(data).map((planet, index) => (
        <PlanetOrbit 
          key={index} 
          position={[planet.a/500, 0, 0]} 
          sphereGeometry={[planet.radiusInEarthRadii/20, 20, 20]}
          data={planet}
          hidden={props.planetData[Object.keys(data)[index]]}
          isSpirograph={props.isSpirograph}
          twoPositions={twoPositions}
          setTwoPositions={setTwoPositions}
          clearSpiro={props.clearSpiro}
          centerObject={props.centerObject}
      />
      ))}
        
    </Canvas>
  )
}

function Sun({position, sphereGeometry, centerObject, clearSpiro, setTwoPositions, hidden}) {
  const mesh = useRef()
  
  const [t, setT] = useState(0)
  
  const [lines, setLines] = useState([])
  const [trail, setTrail] = useState([])

  useEffect(() => {
    setLines([])
  }, [clearSpiro])


  const [time, angle] = useMemo(() => {
    if (centerObject !== 'sun') {
      const {orbitalPeriod, e } = data[centerObject]
      return timeVsOrbit(orbitalPeriod, e, 0, 0.001)
    }
    else return [[],[]]
  }, [centerObject])

  useFrame(({ gl, scene, camera }, delta) => {
    if (centerObject !== "sun") {
      const angleTurned = interpolate(time, angle, t)
      if (t <= time[time.length-1] ) setT(t => t + delta / 12 * speedRamp)
      else setT(t => t-time[time.length-1])
      
      const radius = ellipseEquation(data[centerObject].a, data[centerObject].e, angleTurned)
      const inclination = data[centerObject].angle/180*Math.PI
      mesh.current.position.x = -Math.cos(angleTurned) * radius * Math.cos(inclination)
      mesh.current.position.y = -Math.sin(angleTurned) * radius
      mesh.current.position.z = -Math.cos(angleTurned) * radius * -Math.sin(inclination)

      sunCoords = [mesh.current.position.x, mesh.current.position.y, mesh.current.position.z]
    }

    if (t >= delta / 1 * speedRamp && centerObject !== 'sun' ) {
      setTrail(prev => [...prev, new Vector3(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z)])
    }
    if (hasSpeedRamp && !hidden) {
      setTwoPositions(past => [...past, Object.values(mesh.current.position)])
      // if (props.twoPositions.length % 2 === 0 && props.twoPositions.length !== 0) {
        if (twoPositions.length >= 2 + Math.round(20 - sampleFrequencySpirograph*2)) {
        // console.log(props.twoPositions)
        setLines(past => [...past, <JoiningLine position={twoPositions}/>])
        setTwoPositions([])
      }
    }
    return gl.render(scene, camera)
  },1)

  return (
    <mesh position={position} ref={mesh}>
      <sphereGeometry args={sphereGeometry}/>
      <meshStandardMaterial color={'orange'} />
    </mesh>
  )
}

function PlanetOrbit(props) {
  const {orbitalPeriod, e } = props.data
  const [time, angle] = useMemo(() => timeVsOrbit(orbitalPeriod, e, 0, 0.001), [])

  const geometry = useMemo(() => {
    const xRadius = props.data.a
    const yRadius = Math.sqrt((1 - Math.pow(props.data.e, 2)) * Math.pow(xRadius, 2))
    const inclination = props.data.angle/180*Math.PI

    const curve = new EllipseCurve(ellipseEquation(props.data.a, props.data.e, 0) - xRadius, 0, xRadius, yRadius, 0, 2 * Math.PI, false, 0)
    return new BufferGeometry().setFromPoints(curve.getPoints(50)).rotateY(inclination)
  }, [])

  return (
    <>
        {!props.hidden && props.centerObject === 'sun' && <line geometry={geometry}>
            <lineBasicMaterial color={'white'} linewidth={0.1} resolution={[1, 1]}/>
        </line>}
        <Planet {...props} time={time} angle={angle} centerObject={props.centerObject}/>
    </>
  )
}

function Planet(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  
  const [t, setT] = useState(0)

  const [lines, setLines] = useState([])
  const [trail, setTrail] = useState([])

  useEffect(() => {
    setLines([])
  }, [props.clearSpiro])

  // Subscribe this component to the render-loop, this will try run once every 60 seconds
  useFrame(({ gl, scene, camera }, delta) => {
    // console.log(state)
    const angleTurned = interpolate(props.time, props.angle, t)
    if (t <= props.time[props.time.length-1] ) setT(t => t + delta / 12 * speedRamp)
    else setT(t => t-props.time[props.time.length-1])
    // if (props.data.color === "#3b74ad") console.log(t)
    
    const radius = ellipseEquation(props.data.a, props.data.e, angleTurned)
    const inclination = props.data.angle/180*Math.PI
    if (props.centerObject !== props.data.object) {
      mesh.current.position.x = Math.cos(angleTurned) * radius * Math.cos(inclination) + sunCoords[0]
      mesh.current.position.y = Math.sin(angleTurned) * radius + sunCoords[1]
      mesh.current.position.z = Math.cos(angleTurned) * radius * -Math.sin(inclination) + sunCoords[2]
    } else {
      mesh.current.position.x = 0
      mesh.current.position.y = 0
      mesh.current.position.z = 0
    }

    if (t >= delta / 1 * speedRamp && props.centerObject !== 'sun' ) {
      setTrail(prev => [...prev, new Vector3(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z)])
    }
    if (hasSpeedRamp && !props.hidden) {
      props.setTwoPositions(past => [...past, Object.values(mesh.current.position)])
      // if (props.twoPositions.length % 2 === 0 && props.twoPositions.length !== 0) {
        if (props.twoPositions.length >= 2 + Math.round(20 - sampleFrequencySpirograph*2)) {
        // console.log(props.twoPositions)
        setLines(past => [...past, <JoiningLine position={props.twoPositions}/>])
        props.setTwoPositions([])
      }
    }
    return gl.render(scene, camera)
    // console.log(sunCoords)
  }, 2)

  const trailGeometry = useMemo(() => new BufferGeometry().setFromPoints(trail), [trail])

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <>
      {props.centerObject !== 'sun' && <line geometry={trailGeometry}>
            <lineBasicMaterial color={'white'} linewidth={0.1} resolution={[1, 1]} />
          </line>}
      <mesh
        {... props}
        ref={mesh}>
        {!props.hidden && <>
          
          <sphereGeometry args={props.sphereGeometry}/>
          <meshStandardMaterial color={props.data.color} />
        </>}
      </mesh>
      {lines}
    </>
  )
}

function JoiningLine({position}) {

  const geometry = useMemo(() => {
    let points = [];
    points.push( new Vector3( position[position.length-2][0], position[position.length-2][1], position[position.length-2][2] ) );
    points.push( new Vector3( position[position.length-1][0], position[position.length-1][1], position[position.length-1][2] ) );
    
    const geometry = new BufferGeometry().setFromPoints( points );
    return geometry
  }, [])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={'white'} linewidth={0.1} resolution={[1, 1]} />
    </line>
  )
}