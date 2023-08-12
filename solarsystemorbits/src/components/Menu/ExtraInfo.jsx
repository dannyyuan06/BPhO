import { useState } from "react";

let timeout

export function ExtraInfo({children, title}) {

    const [hovered, setHovered] = useState(false)

    const mouseEnter = () => {
        timeout = setTimeout(() => {
            setHovered(true)
        }, 600);
    }
    const mouseLeave = () => {
        clearTimeout(timeout)
        setHovered(false)
    }

    return (
        <span className="extra-info-container">
            <h3 onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>{title}</h3>
            { hovered &&
                <div className="info-container">
                    {children}
                </div>
            }
        </span>
    )
}