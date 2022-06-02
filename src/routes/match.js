import { useEffect, useState } from "react"
import MatchWrapper from "../components/match-wrapper"
import { useNavigate } from 'react-router-dom';

const Match = ({auth}) => {
  let [matches, setMatches] = useState([])
  const navigate = useNavigate();
  
  const handleFindMatches = () => {
    fetch(`http://localhost:9000/match/clearMatches/${auth.sessionID}`)
    .then(() => fetch(`http://localhost:9000/match/createMatches/${auth.sessionID}`))
    .then(res => res.json())
    .then(json => {
      if(json.error === "Ideal"){
        navigate("/ideal", {state: {error: "Please finish setting up your ideals"}})
      }else if(json.error === "Profile"){
        navigate("/profile", {state: {error: "Please finish setting up your profile"}})
      }else{
        fetch(`http://localhost:9000/match/getMatches/${auth.sessionID}`)
        .then(res => res.json())
        .then(json => setMatches(json))
      }
    })
  }

  useEffect(() => {
    if(matches.length === 0){
      handleFindMatches()
    }
  }, [matches])

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
  }else{
    return(
      <MatchWrapper 
        auth={auth}
        matches={matches}
        setMatches={setMatches}
      />
    )
  }


  
}
export default Match