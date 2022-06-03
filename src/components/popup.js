import { useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const Popup = ({setShow, children, classes, }) => {
  let ref = React.createRef();
  useEffect(() => {
    window.addEventListener("mousedown", handleClick)
    return () => {
      window.removeEventListener("mousedown", handleClick)
    }
  })
  const handleClick = (e) => {
    if (!ref.current.contains(e.target)){
      handleHide()
    }
  }
  const handleHide = () => {
    setShow(false)
  }
  return(
    <div className="popup-bg">
      <div className={classes} ref={ref}>
      {children}
        <button className="close-popup trans-btn" aria-label="Close Popup" onClick={handleHide} >
          <FontAwesomeIcon icon={faXmark}/>
        </button>
      </div>
    </div>
  )
}
export default Popup