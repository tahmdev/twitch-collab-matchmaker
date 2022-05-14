import { useEffect, useState } from "react"

const Profile = ({auth}) => {
  let [edit, setEdit] = useState(false)
  let [description, setDescription] = useState("loading...")
  let [age, setAge] = useState("loading...")
  let [gender, setGender] = useState("loading...")
  useEffect(() => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setDescription(json[0].description || "")
      setAge(json[0].age || "")
      setGender(json[0].gender || "")
    })
  }, [])
  
  const save = () => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },      
      body: JSON.stringify({
        description: description,
        age: age,
        gender: gender
      })
    })
  }

  if(edit) return(
    <div>
      <textarea type="textarea" value={description} onChange={e => setDescription(e.target.value)} />
      <p> Age: {age} </p>
      <p> Gender: {gender} </p>
      <button onClick={save} > Save </button>
    </div>
  )
  return(
    <div>
      <button onClick={() => setEdit(true)}>Edit</button>
      <p> Description: {description} </p>
      <p> Age: {age} </p>
      <p> Gender: {gender} </p>
    </div>
  )
}
export default Profile