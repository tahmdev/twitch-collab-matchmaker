import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const PopupButton = ({classes, triangle, children, popupClasses, show, setShow, ...rest }) => {
  let ref = useRef()

  const handleClick = () => {
    setShow(prev => !prev)
  }

  const handleMouseDown = (e) => {
    if (ref && !ref.current.contains(e.target)){
      setShow(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [handleMouseDown])

  return(
    <div  className={`popup-button-wrapper  ${classes}`} ref={ref} >
      <button className={`popup-button`} onClick={handleClick} aria-expanded={show}  {...rest} >
        <>
          {triangle && <FontAwesomeIcon className="navbar-popup-icon" icon={faAngleDown} style={ show ? {transform: "rotateZ(180deg)"} : null } />}
          {children[0]}
        </>
      </button>
      {show && 
      <div className={`popup-button-popup ${popupClasses}`}  >
        {children[1]}  
      </div>
      }
    </div>

  )
}

export default PopupButton