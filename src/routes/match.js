import { useEffect, useRef, useState } from "react"
import useEventListener from "../hooks/useEventListener"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'

const Match = ({auth}) => {
  let [matches, setMatches] = useState([])
  let [dragging, setDragging] = useState(false)
  const matchRef = useRef()
  const initialPos = useRef()
  useEffect(() => {
    if(matches.length === 0){
      handleFindMatches()
    }
  }, [matches])

  const handleFindMatches = () => {
    fetch(`http://localhost:9000/match/clearMatches/${auth.sessionID}`)
    .then(() => fetch(`http://localhost:9000/match/createMatches/${auth.sessionID}`))
    .then(() => fetch(`http://localhost:9000/match/getMatches/${auth.sessionID}`))
    .then(res => res.json())
    .then(json => setMatches(json))
  }

  const handleNotInterested = () => {
    fetch(`http://localhost:9000/match/setNotInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
    .then(() => setMatches(prev => prev.slice(1)))
  }

  const handleInterested = () => {
    fetch(`http://localhost:9000/match/setInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
    .then(() => setMatches(prev => prev.slice(1)))

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
    }
    document.getElementById("interested-icon").style.opacity  = (e.pageX - initialPos.current) / 130
    document.getElementById("not-interested-icon").style.opacity  = (e.pageX - initialPos.current) / 130 * -1
  }

  const handleDragEnd = (e) => {
    if(dragging){
      matchRef.current.style.transition = "all 150ms ease-in-out"
      if(e.pageX - initialPos.current >= 130){
        matchRef.current.style.transform = `translateX(${window.innerWidth}px)`
        setTimeout(() => {
          //handleInterested()
          matchRef.current.style.transition = "all 0ms ease-in-out"
          matchRef.current.style.transform = `translateX(${-window.innerWidth}px)`
          setTimeout(() => {
            matchRef.current.style.transition = "all 150ms ease-in-out"
            matchRef.current.style.transform = `translateX(${0}px)`
          }, 15);
        }, 150);
      }else if(e.pageX - initialPos.current <= -130){
        matchRef.current.style.transform = `translateX(${-window.innerWidth}px)`
        setTimeout(() => {
          //handleNotInterested()
          matchRef.current.style.transition = "all 0ms ease-in-out"
          matchRef.current.style.transform = `translateX(${window.innerWidth}px)`
          setTimeout(() => {
            matchRef.current.style.transition = "all 150ms ease-in-out"
            matchRef.current.style.transform = `translateX(${0}px)`
          }, 15);
        }, 150);
      }else{
        matchRef.current.style.transform = `translateX(${0}px)`
      }
    }
    
    setDragging(false)
  }

  useEventListener("mousedown", handleDragStart, matchRef, matchRef.current !== undefined)
  useEventListener("mousemove", handleDragMove, document, matchRef.current !== undefined)
  useEventListener("mouseup", handleDragEnd, document, matchRef.current !== undefined)

  const handleTouchStart = (e) => handleDragStart(e.touches[0])
  const handleTouchMove = (e) => handleDragMove(e.touches[0])
  const handleTouchEnd = (e) => handleDragEnd(e.changedTouches[0])

  useEventListener("touchstart", handleTouchStart, matchRef, matchRef.current !== undefined)
  useEventListener("touchmove", handleTouchMove, document, matchRef.current !== undefined)
  useEventListener("touchend", handleTouchEnd, document, matchRef.current !== undefined)



  if(matches.length === 0){
    return(
      <div className="match">
        Finding matches please wait...
      </div>
    )
  }

  if(matches[0] === "No matches"){
    return(
      <div> We could not find any matches for you. Lower your standards or try again later. </div>
    )
  }

  return(
    <div className="match-wrapper" >
      <div className="container--small match-btn-container">
        <div className="match" ref={matchRef}>
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
        <FontAwesomeIcon icon={faCheck} id="interested-icon" />
        <FontAwesomeIcon icon={faX} id="not-interested-icon" />
        <FontAwesomeIcon icon={faCheck} id="under-interested-icon" />
        <FontAwesomeIcon icon={faX} id="under-not-interested-icon"/>
      </div>
       
    </div>
  )
}
export default Match