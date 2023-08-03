import { CameraControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import { data, speedRamp, speedRampUpSpeed, sampleFrequencySpirograph } from "../../App"
import { ellipseEquation } from "../../calculations/ellipse";
import { BufferGeometry, EllipseCurve, Vector3 } from "three";

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
      <Sun position={[0, 0, 0]} sphereGeometry={[0.3, 20, 20]}/>
      {Object.values(data).map((planet, index) => (
        <PlanetOrbit 
          key={index} 
          position={[planet.aphelion10_6Km/100, 0, 0]} 
          sphereGeometry={[planet.volumetricMeanRadiusKm/200000, 20, 20]} 
          angularVelocity={Math.PI*2/planet.siderealOrbitPeriodDays} 
          data={planet}
          hidden={props.planetData[Object.keys(data)[index]]}
          isSpirograph={props.isSpirograph}
          twoPositions={twoPositions}
          setTwoPositions={setTwoPositions}
          clearSpiro={props.clearSpiro}
      />
      ))}
        
    </Canvas>
  )
}

function Sun(props) {
    // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Return view, these are regular three.js elements expressed in JSX

  return (
    <mesh
      {... props}
      ref={mesh}>
      <sphereGeometry args={props.sphereGeometry}/>
      <meshStandardMaterial color={'orange'} />
    </mesh>
  )
}

function PlanetOrbit(props) {

  const geometry = useMemo(() => {
    const xRadius = (props.data.aphelion10_6Km + props.data.perihelion10_6Km)/200
    const yRadius = Math.sqrt((1 - Math.pow(props.data.orbitEccentricity, 2)) * Math.pow(xRadius, 2))
    const inclination = props.data.orbitInclinationDeg/180*Math.PI

    const curve = new EllipseCurve((props.data.aphelion10_6Km/100 - xRadius), 0, xRadius, yRadius, 0, 2 * Math.PI, false, 0)
    return new BufferGeometry().setFromPoints(curve.getPoints(50)).rotateY(inclination)
  }, [])

  console.log(props.hidden)
  return (
    <>
        {!props.hidden && <line geometry={geometry}>
            <lineBasicMaterial color={'white'} linewidth={0.1} resolution={[1, 1]}/>
        </line>}
        <Planet {...props} />
    </>
  )
}

function Planet(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  
  const [t, setT] = useState(0)

  const [lines, setLines] = useState([])

  useEffect(() => {
    setLines([])
  }, [props.clearSpiro])

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (t <= Math.PI*2 ) setT(t => t+props.angularVelocity*speedRamp)
    else setT(t-Math.PI*2)
    const radius = ellipseEquation(props.data.aphelion10_6Km, props.data.perihelion10_6Km, props.data.orbitEccentricity, t)
    const inclination = props.data.orbitInclinationDeg/180*Math.PI
    mesh.current.position.x = Math.cos(t) * radius * Math.cos(inclination)
    mesh.current.position.y = Math.sin(t) * radius
    mesh.current.position.z = Math.cos(t) * radius * -Math.sin(inclination)
    if (speedRamp === speedRampUpSpeed && !props.hidden) {
      props.setTwoPositions(past => [...past, Object.values(mesh.current.position)])
      // if (props.twoPositions.length % 2 === 0 && props.twoPositions.length !== 0) {
        if (props.twoPositions.length >= 2 + Math.round(20 - sampleFrequencySpirograph*2)) {
        console.log(props.twoPositions)
        setLines(past => [...past, <JoiningLine position={props.twoPositions}/>])
        props.setTwoPositions([])
      }
    }
  })

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <>
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