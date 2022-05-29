import { useEffect, useRef, useState } from "react"
import useEventListener from "../hooks/useEventListener"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'

const MatchWrapper = ({auth, matches, setMatches}) => {
  let [dragging, setDragging] = useState(false)
  const matchRef = useRef()
  const initialPos = useRef()

  const handleNotInterested = () => {
      matchRef.current.style.transition = "all 150ms ease-in-out"
      matchRef.current.style.transform = `translateX(${-window.innerWidth}px)`
      setTimeout(() => {
          document.getElementById("not-interested-icon").style.opacity = 0
          matchRef.current.style.transition = "all 0ms ease-in-out"
          matchRef.current.style.transform = `translateX(${window.innerWidth}px)`
          setTimeout(() => {
            matchRef.current.style.transition = "all 150ms ease-in-out"
            matchRef.current.style.transform = `translateX(${0}px)`

            fetch(`http://localhost:9000/match/setNotInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
            .then(() => setMatches(prev => prev.slice(1)))
          }, 15);
      }, 150);
  }

  const handleInterested = () => {
    matchRef.current.style.transition = "all 150ms ease-in-out"
    matchRef.current.style.transform = `translateX(${window.innerWidth}px)`
    setTimeout(() => {
      document.getElementById("interested-icon").style.opacity = 0
      matchRef.current.style.transition = "all 0ms ease-in-out"
      matchRef.current.style.transform = `translateX(${-window.innerWidth}px)`
      setTimeout(() => {
        matchRef.current.style.transition = "all 150ms ease-in-out"
        matchRef.current.style.transform = `translateX(${0}px)`
        
        fetch(`http://localhost:9000/match/setInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
        .then(() => setMatches(prev => prev.slice(1)))
      }, 15);
    }, 150);
  }

  const handleDragStart = (e) => {
    setDragging(true)
    matchRef.current.style.transition = "all 0ms ease-in-out"
    initialPos.current = e.pageX
  }

  const handleDragMove = (e) => {
    if(dragging && (e.pageX > initialPos.current + 40 || e.pageX < initialPos.current - 40)){
      matchRef.current.style.transform = `
          translateX(${e.pageX > initialPos.current 
          ? e.pageX - initialPos.current - 40 
          : e.pageX - initialPos.current + 40}px)
        `
      document.getElementById("interested-icon").style.opacity  = (e.pageX - initialPos.current) / 130
      document.getElementById("not-interested-icon").style.opacity  = (e.pageX - initialPos.current) / 130 * -1
    }
  }

  const handleDragEnd = (e) => {
    if(dragging){
      if(e.pageX - initialPos.current >= 130){
        handleInterested()
      }else if(e.pageX - initialPos.current <= -130){
        handleNotInterested()
       
      }else{
        document.getElementById("interested-icon").style.opacity = 0
        document.getElementById("not-interested-icon").style.opacity = 0
        matchRef.current.style.transform = `translateX(${0}px)`
      }
    }
    setDragging(false)
  }

  useEventListener("mousedown", handleDragStart, matchRef.current, matchRef.current !== undefined, true)
  useEventListener("mousemove", handleDragMove, document, matchRef.current !== undefined, true)
  useEventListener("mouseup", handleDragEnd, document, matchRef.current !== undefined, true)

  const handleTouchStart = (e) => handleDragStart(e.touches[0])
  const handleTouchMove = (e) => handleDragMove(e.touches[0])
  const handleTouchEnd = (e) => handleDragEnd(e.changedTouches[0])

  useEventListener("touchstart", handleTouchStart, matchRef.current, matchRef.current !== undefined, true )
  useEventListener("touchmove", handleTouchMove, document, matchRef.current !== undefined, true )
  useEventListener("touchend", handleTouchEnd, document, matchRef.current !== undefined, true )

  return(
    <div className="match-wrapper" >
      <div className="container--small match-btn-container">
        <div className="match" ref={matchRef} id="match" >
          <div>
            <h1> {matches[0].name} </h1>
          </div>
          <div className="split">
            <img src={matches[0].profilePicture} />
            <div className="flex-column">
              <p> Gender: {matches[0].gender} </p>
              <p> Age: {matches[0].age} </p>
              <p> Viewers: {matches[0].viewCount} </p>
            </div>
          </div>
          <div className="about-me">
            <h2>About me:</h2>
            <p className="linebreak" > {matches[0].description} </p>
          </div>
  
          <div className="tags">
            <h3>Tags:</h3>
            <ul>
              { 
                JSON.parse(matches[0].tags).map(i => <li key={i}>{i}</li>)
              }
            </ul>
          </div>
        </div>
        <button className="trans-btn interested-btn" onClick={handleInterested} >
          <FontAwesomeIcon icon={faCheck} id="interested-icon" />
        </button>
        <button className="trans-btn not-interested-btn" onClick={handleNotInterested} >
          <FontAwesomeIcon icon={faX} id="not-interested-icon" />
        </button>
        <FontAwesomeIcon icon={faCheck} id="under-interested-icon" />
        <FontAwesomeIcon icon={faX} id="under-not-interested-icon"/>
      </div>
       
    </div>
  )
}
export default MatchWrapper