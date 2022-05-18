import { useEffect, useRef, useState } from "react"
import BirthdayInput from "../components/birthdayInput"
import Select from 'react-select'
import moment from "moment"
import tagList from "../data/tagList"

const Profile = ({auth}) => {
  let [edit, setEdit] = useState(false)
  let [description, setDescription] = useState("")
  let [birthday, setBirthday] = useState("1900-01-01")
  let [validDate, setValidDate] = useState(true)
  let [gender, setGender] = useState("")
  let [tags, setTags] = useState([])
  let prevRef = useRef()
 
  //Set initial values
  useEffect(() => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setDescription(json[0].description || "")
      setBirthday(json[0].birthday || "")
      setGender(json[0].gender || "")
      setTags(JSON.parse(json[0].tags).map(i => {
        return {value: i, label: i}
      }))
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
        gender: gender,
        tags: tags.map(i => i.value)
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

  const handleDateChange = (date, dateIsValid) => {
    setValidDate(dateIsValid)
    if(dateIsValid) setBirthday(date)
  }
  useEffect(() => {
    console.log(tags)
  }, [tags])
  
  if(edit) return(
    <div className="edit-profile">
      
      <label>
        <span>About Me: </span>
        <textarea id="Description" type="textarea" value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      
      <BirthdayInput 
        minimumAge={13} 
        callback={handleDateChange}
        initial={birthday}
        />
      
      <label>
        <span> Gender: </span>
        <Select
          placeholder = "Select your gender"
          onChange={selected => setGender(selected.value)}
          value={{value: gender, label: gender}}
          options = {[
            {value: "Male", label: "Male"},
            {value: "Female", label: "Female"},
            {value: "Other", label: "Other"}
          ]}
        />
      </label>
      
      <label>
        <span> Tags: </span>
        <Select 
          placeholder="Select up to 5 tags"
          value={tags}
          onChange={selected => setTags(selected)}
          isMulti={true}
          closeMenuOnSelect={false}
          isOptionDisabled={() => tags.length >= 5}
          options={tagList}
        />
      </label>
      <button onClick={handleSave} disabled={!validDate}  > Save </button>
      <button onClick={handleCancel} > Cancel </button>
    </div>
  )
  return(
    <div>
      <button onClick={handleEdit} >Edit</button>
      <p className="linebreak" > {"Description:\n"} {description} </p>
      <p> Birthday: {moment(birthday).format("YYYY-MM-DD")} </p>
      <p> Gender: {gender} </p>
      <ul>
        { 
          tags.map(i => <li key={i.value} >{i.value}</li>)
        }
      </ul>
    </div>
  )
}
export default Profile