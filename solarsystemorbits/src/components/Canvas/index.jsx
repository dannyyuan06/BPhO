import { CameraControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import { data, speedRamp, speedRampUpSpeed, sampleFrequencySpirograph, hasSpeedRamp } from "../../App"
import { ellipseEquation } from "../../calculations/ellipse";
import { BufferGeometry, EllipseCurve, Vector3 } from "three";
import { linespace } from "../../calculations/linespace";
import { timeVsOrbit } from "../../calculations/timeVsOrbit";
import { interpolate } from "../../calculations/interpolation";
import { calculatePositions } from "../../calculations/positions";

export function CanvasWrapper(props) {

  const objects = Object.values(data[props.solarSystem])
  let bufferPlaceholder = {}
  let reqQuestBufferPlaceholder = {}
  objects.forEach(object => bufferPlaceholder[object.object] = false)
  objects.forEach(object => reqQuestBufferPlaceholder[object.object] = true)

  const [twoPositions, setTwoPositions] = useState([])
  const [buffer, setBuffer] = useState(bufferPlaceholder)
  const [objectPositions, setObjectPositions] = useState(objects.map(_ => []))
  const [requestBuffer, setRequestBuffer] = useState(reqQuestBufferPlaceholder)
  const [lines, setLines] = useState([])

  useEffect(() => {
    if (!props.isSpirograph) {
      setTwoPositions([])
    }
  },[props.isSpirograph])

  useEffect(() => {
    const reduced = Object.values(requestBuffer).reduce((prev, curr) => curr === prev && curr === true)
    if (reduced) {
      const promise = new Promise((resolve, reject) => {
        // const [frames, nextBuffer] = calculatePositions(props.centerObject, buffer, 1/60/12, props.solarSystem, objects[0].object)
        //   const transposedFrames = frames[0].map((_, colIndex) => frames.map(row => row[colIndex]));
        //   resolve([transposedFrames, nextBuffer])
        getRepaintInterval().then((fr) => {
          const [frames, nextBuffer] = calculatePositions(props.centerObject, buffer, fr/12000, props.solarSystem, objects[0].object)
          const transposedFrames = frames[0].map((_, colIndex) => frames.map(row => row[colIndex]));
          resolve([transposedFrames, nextBuffer])
        })
      })
      promise.then(([frames, nextBuffer]) =>{
        setObjectPositions(frames)
        setBuffer(nextBuffer)
      })
      setRequestBuffer(bufferPlaceholder)
    }
  }, [requestBuffer])

  useEffect(() => {
    if (hasSpeedRamp && twoPositions.length >= 2) {
      setLines(lines => [...lines, <JoiningLine key={lines.length} position={twoPositions}/>])
      setTwoPositions([])
    }
  }, [twoPositions])

  useEffect(() => {
    setLines([])
  }, [props.clearSpiro])

  return (
    <Canvas>
      <CameraControls/>
      <ambientLight/>
      <pointLight position={[0, 0, 0]} intensity={props.lightIntensity}/>
      {objects.map((planet, index) => (
        <PlanetOrbit 
          key={index}
          sphereGeometry={[index !== 0 ? planet.radiusInEarthRadii/2000*props.objectSize : planet.radiusInEarthRadii/2000*props.starSize, 20, 20]}
          data={planet}
          hidden={props.planetData[planet.object]}
          twoPositions={twoPositions}
          setTwoPositions={setTwoPositions}
          clearSpiro={props.clearSpiro}
          centerObject={props.centerObject}
          objectPositions={objectPositions[index]}
          setRequestBuffer={setRequestBuffer}
          sun={objects[0].object}
      />
      ))}
      {lines}
    </Canvas>
  )
}

function PlanetOrbit(props) {
  const {orbitalPeriod, e, a, angle } = props.data

  const geometry = useMemo(() => {
    const xRadius = a
    const yRadius = Math.sqrt((1 - Math.pow(e, 2)) * Math.pow(xRadius, 2))
    const inclination = angle/180*Math.PI

    const curve = new EllipseCurve(ellipseEquation(a, e, 0) - xRadius, 0, xRadius, yRadius, 0, 2 * Math.PI, false, 0)
    return new BufferGeometry().setFromPoints(curve.getPoints(50)).rotateY(inclination)
  }, [])

  return (
    <>
        {!props.hidden && props.centerObject === props.sun && <line geometry={geometry}>
            <lineBasicMaterial color={'white'} linewidth={0.1} resolution={[1, 1]}/>
        </line>}
        <Planet {...props} centerObject={props.centerObject}/>
    </>
  )
}

function Planet(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  
  const [t, setT] = useState(1)

  const [lines, setLines] = useState([])
  const [trail, setTrail] = useState([])

  const frames = useRef([])
  const lineFidelityBuffer = useRef(0)
  const spirographTimePeriodBuffer = useRef(0)

  useEffect(() => {
    frames.current = [...frames.current, ...props.objectPositions]
  }, [props.objectPositions])

  useEffect(() => {
    if (!props.hidden) {
      setTrail([])
    }
  }, [props.hidden, props.centerObject])

  // Subscribe this component to the render-loop, this will try run once every 60 seconds
  useFrame((scene, delta) => {
    if (props.objectPositions.length === 0) return
    
    for (let i=0;i<speedRamp;i++) {
      const objectName = props.data.object

      const lineFidelity = props.data.distanceFromSun > 5 ? 16 : 4
      const spirographTimePeriod = Math.floor(1/sampleFrequencySpirograph*120) 

      const frame = frames.current[0]
      const nextFrame = frames.current[1]

      mesh.current.position.x = frame[0]
      mesh.current.position.y = frame[1]
      mesh.current.position.z = frame[2]

      setT(t=>{
        if (t === 1) {
          props.setRequestBuffer(prev => ({...prev, [objectName]: true}))
        }
        if (t%lineFidelity === lineFidelityBuffer.current && props.centerObject !== props.sun && !props.hidden) {
          setTrail(prev => [...prev, new Vector3(nextFrame[0], nextFrame[1], nextFrame[2])])
        }
        if (t%spirographTimePeriod === spirographTimePeriodBuffer.current && hasSpeedRamp && !props.hidden) {
          props.setTwoPositions(past => [...past, Object.values(mesh.current.position)])
        }
        let newT = 0
        if (t > 1000) {
          newT = 1
          lineFidelityBuffer.current = lineFidelity - t%lineFidelity
          spirographTimePeriodBuffer.current = spirographTimePeriod - t%spirographTimePeriod
        }
        else {
          newT = t+1
        }
        return t>1000?1:t+1
      })
      frames.current.shift()
    }
  })

  const trailGeometry = useMemo(() => new BufferGeometry().setFromPoints(trail), [trail])

  return (
    <>
      {props.centerObject !== props.sun && !props.hidden && <line geometry={trailGeometry}>
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
      {/* {lines} */}
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

const getRepaintInterval = () => {
  return new Promise((resolve) => {
    requestAnimationFrame((t1) => {
      requestAnimationFrame((t2) => {
        resolve(t2 - t1);
      });
    });
  });
};