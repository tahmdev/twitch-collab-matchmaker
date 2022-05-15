import { useEffect, useRef, useState } from "react"
import BirthdayInput from "../components/birthdayInput"
import Select from 'react-select'
import moment from "moment"

const Profile = ({auth}) => {
  let [edit, setEdit] = useState(false)
  let [description, setDescription] = useState("loading...")
  let [birthday, setBirthday] = useState("1900-01-01")

  let [gender, setGender] = useState("loading...")
  let prevRef = useRef()
 
  useEffect(() => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setDescription(json[0].description || "")
      setBirthday(json[0].birthday || "")
      setGender(json[0].gender || "")
    })
  }, [])
  
  const handleEdit = () => {
    prevRef.current = {
      description: description,
      birthday: birthday,
      gender: gender,
    }
    setEdit(true)
  }

  const handleSave = () => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },      
      body: JSON.stringify({
        description: description,
        birthday: birthday,
        gender: gender
      })
    })
    setEdit(false)
    console.log("AAAA", birthday)
  }

  const handleCancel = () => {
    let {description, birthday, gender, } = prevRef.current
    setDescription(description)
    setBirthday(birthday)
    setGender(gender)
    setEdit(false)
  }

  if(edit) return(
    <div className="edit-profile">
      <label>
        <span>About Me: </span>
        <textarea id="Description" type="textarea" value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <BirthdayInput 
        minimumAge={13} 
        callback={setBirthday}
        initial={birthday}
        />
      <label>
      <span> Gender: </span>
      <Select
        placeholder = "Select your gender"
        onChange={selected => setGender(selected.value)}
        options = {[
          {value: "Male", label: "Male"},
          {value: "Female", label: "Female"},
          {value: "other", label: "Other"}
        ]}
      />
      </label>

      <button onClick={handleSave} > Save </button>
      <button onClick={handleCancel} > Cancel </button>
    </div>
  )
  return(
    <div>
      <button onClick={handleEdit}>Edit</button>
      <p> Description: {description} </p>
      <p> Birthday: {moment(birthday).format("YYYY-MM-DD")} </p>
      <p> Gender: {gender} </p>
    </div>
  )
}
export default Profile