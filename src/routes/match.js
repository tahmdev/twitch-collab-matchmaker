import { useEffect, useState } from "react"

const Match = ({auth}) => {
  let [matches, setMatches] = useState([])
  
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

  const handleNotInterested = (id) => {
    fetch(`http://localhost:9000/match/setNotInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
    .then(() => setMatches(prev => prev.slice(1)))
  }

  const handleInterested = (id) => {
    fetch(`http://localhost:9000/match/setInterested/${auth.sessionID}/${matches[0].id}`, {method: "PUT"})
    .then(() => setMatches(prev => prev.slice(1)))

  }

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
      <div className="container--small match">
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

        <button onClick={() => handleNotInterested(matches[0].id)}>Not interested</button>
        <button onClick={() => console.log(matches)} >log</button>
        <button onClick={() => handleInterested(matches[0].id)}>Interested</button>
      </div>
      
       
    </div>
  )
}
export default Match