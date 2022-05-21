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
    <div>
       {matches[0].name}
       <button onClick={() => handleNotInterested(matches[0].id)}>Not interested</button>
       <button onClick={() => console.log(matches)} >log</button>
       <button onClick={() => handleInterested(matches[0].id)}>Interested</button>
    </div>
  )
}
export default Match