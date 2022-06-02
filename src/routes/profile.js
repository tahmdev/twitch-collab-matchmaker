import { useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import BirthdayInput from "../components/birthdayInput"
import Select from 'react-select'
import Toast from "../components/toast"
import moment from "moment"
import tagList from "../data/tagList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Profile = ({auth}) => {
  const location = useLocation()
  console.log(location)
  let [edit, setEdit] = useState(false)
  let [description, setDescription] = useState("")
  let [birthday, setBirthday] = useState("1900-01-01")
  let [validDate, setValidDate] = useState(true)
  let [gender, setGender] = useState("")
  let [tags, setTags] = useState([])
  let [viewCount, setViewCount] = useState()
  let prevRef = useRef()
  let [toast, setToast] = useState(() => {
    if(location.state){
      return ([{
        text: location.state.error,
        type: "Error"
      }])
    }else{
      return []
    }
  })

  //Set initial values
  useEffect(() => {
    fetch(`http://localhost:9000/db/getUser/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setDescription(json[0].description || "")
      setBirthday(json[0].birthday || "")
      setGender(json[0].gender || "")
      setViewCount(json[0].viewCount || 0)
      if(json[0].tags) setTags(JSON.parse(json[0].tags).map(i => {
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
    fetch(`http://localhost:9000/db/setUser/${auth.sessionID}`, {
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

  const getAgeFromBirthday = (birthday) => {
    let b = moment(birthday)
    let age = moment().subtract(b.format("YYYY"), "y").subtract(b.format("MM"), "M").subtract(b.format("DD"), "d")
    return Number(age.format("YYYY"))
  }
  
  if(edit) return(
    <div className="profile-wrapper">
      <div className="container--small edit-profile profile">

        
        <BirthdayInput 
          minimumAge={13} 
          callback={handleDateChange}
          initial={birthday}
          />
        
        <label>
          <span> Gender: </span>
          <Select
            className="react-select"
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
            className="react-select"
            placeholder="Select up to 5 tags"
            value={tags}
            onChange={selected => setTags(selected)}
            isMulti={true}
            closeMenuOnSelect={false}
            isOptionDisabled={() => tags.length >= 5}
            options={tagList}
          />
        </label>

        <label>
          <span>About Me: </span>
          <textarea id="Description" type="textarea" value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        
        <div className="split">
          <button className="secondary-btn" onClick={handleCancel} > Cancel </button>
          <button className="primary-btn" onClick={handleSave} disabled={!validDate}  > Save </button>
        </div>
      </div>
    </div>
  )
  return(
    <div className="profile-wrapper" >
      <div className="container--small profile">
        <div className="flex-row">
          <h1> {auth.name} </h1>
          <button className="trans-btn edit-profile-btn" onClick={handleEdit} aria-label="Edit profile" >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
        <div className="split">
          <img src={auth.profilePicture} />
          <div className="flex-column">
            <p> Gender: {gender} </p>
            <p> Age: {getAgeFromBirthday(moment(birthday).format("YYYY-MM-DD"))} </p>
            <p> Viewers: {viewCount} </p>
          </div>
        </div>

        <div className="about-me">
          <h2>About me:</h2>
          <p className="linebreak" > {description} </p>
        </div>
        
        <div className="tags">
          <h3>Tags:</h3>
          <ul>
            { 
              tags.map(i => <li key={i.value} >{i.value}</li>)
            }
          </ul>
        </div>

      </div>

      <Toast 
        arr={toast}
        setArr={setToast}
        classes={"ideal-toast-wrapper"}
        autodelete={1800}
        max={3}
      />

    </div>
  )
}
export default Profile