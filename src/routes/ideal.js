import { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Select from 'react-select'
import { AuthContext } from "../App"
import MultiRange from "../components/multiRange"
import Toast from "../components/toast"
import tagList from "../data/tagList"
const Ideal = () => {
  const auth = useContext(AuthContext)
  const location = useLocation()
  let [isLoading, setIsLoading] = useState(true)
  let [partnerStatus, setPartnerStatus] = useState([])
  let [gender, setGender] = useState([])
  let [minAge, setMinAge] = useState(13)
  let [maxAge, setMaxAge] = useState(100)
  let [optionalTags, setOptionalTags] = useState([])
  let [requiredTags, setRequiredTags] = useState([])
  let [viewCount, setViewCount] = useState([])
  let [invalidInput, setInvalidInput] = useState(false)
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


  //Get initial state from db
  useEffect(() => {
    fetch(`http://localhost:9000/db/getIdeal/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setPartnerStatus(JSON.parse(json[0].broadcaster_type).map(i => {return {value: i, label: i } }))
      setGender(JSON.parse(json[0].gender).map(i => {return {value: i, label: i } }))
      setMaxAge(json[0].maxage)
      setMinAge(json[0].minage)
      setOptionalTags(JSON.parse(json[0].optionaltags).map(i => {return {value: i, label: i } }))
      setRequiredTags(JSON.parse(json[0].requiredtags).map(i => {return {value: i, label: i } }))
      setViewCount(JSON.parse(json[0].viewcount).map(i => {return {value: i, label: i } }))
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if(requiredTags.length === 0 && optionalTags.length === 0){
      setInvalidInput(true)
    }else{
      fetch(`http://localhost:9000/db/setIdeal/${auth.sessionID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },      
        body: JSON.stringify({
          minAge: minAge,
          maxAge: maxAge,
          gender: gender.map(i => i.value),
          broadcasterType: partnerStatus.map(i => i.value),
          requiredTags: requiredTags.map(i => i.value),
          optionalTags: optionalTags.map(i => i.value),
          viewCount: viewCount.map(i => i.value),
        })
      })
      .then(res => {
        if(res.ok){
          setToast(prev => [
            ...prev,
            {
              text: "Saved successfuly",
              type: "Success"
            }
          ])
        }else{
          setToast(prev => [
            ...prev,
            {
              text: "Something went wrong",
              type: "Error"
            }
          ])
        }
      })
    }
  }

  useEffect(() => {
    if(requiredTags.length > 0 || optionalTags.length > 0){
      setInvalidInput(false)
    }
  }, [requiredTags, optionalTags])

  const handleAge = (min, max) => {
    setMinAge(min)
    setMaxAge(max)
  }

  return(
    <div className="ideal-wrapper" >
      <div className="container--small ideal">
        <form onSubmit={handleSubmit} >
          <label>
            <span>Twitch Partner Status:</span>
            <Select 
              styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
              classNamePrefix="react-select"
              placeholder="Select all that apply"
              value={partnerStatus}
              onChange={selected => setPartnerStatus(selected)}
              isMulti={true}
              closeMenuOnSelect={false}
              options={[
                {value: "Partner", label: "Partner"},
                {value: "Affiliate", label: "Affiliate"},
                {value: "None", label: "None"},
              ]}
            />
          </label>

          <label >
            <span>Gender: </span>
            <Select 
              styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
              classNamePrefix="react-select"
              placeholder="Select all that apply"
              value={gender}
              onChange={selected => setGender(selected)}
              isMulti={true}
              closeMenuOnSelect={false}
              options={[
                {value: "Male", label: "Male"},
                {value: "Female", label: "Female"},
                {value: "Other", label: "Other"},
              ]}
            />
          </label>

          {!isLoading &&
          <div className="ideal-age-wrapper">
            <label htmlFor="age-input" >Age:</label>
            <MultiRange
              id="age-input"
              min={13}
              max={100}
              minVal={minAge}
              maxVal={maxAge}
              onChange={handleAge}
            />
          </div>

          }

          <label>
            <span>Required Tags:</span>
            <Select 
              classNamePrefix="react-select"
              placeholder="Select all that apply"
              value={requiredTags}
              onChange={selected => setRequiredTags(selected)}
              isMulti={true}
              closeMenuOnSelect={false}
              options={tagList}
            />
          </label>

          <label>
            <span>Optional Tags:</span>
            <Select 
              classNamePrefix="react-select"
              placeholder="Select all that apply"
              value={optionalTags}
              onChange={selected => setOptionalTags(selected)}
              isMulti={true}
              closeMenuOnSelect={false}
              options={tagList}
            />
          </label>

          <label>
            <span>View Count</span>
            <Select 
              classNamePrefix="react-select"
              placeholder="Select all that apply"
              value={viewCount}
              onChange={selected => setViewCount(selected)}
              isMulti={true}
              closeMenuOnSelect={false}
              options={[
                {value: "More than me", label: "More than me"},
                {value: "Same as me", label: "Same as me"},
                {value: "Less than me", label: "Less than me"},
              ]}
            />
          </label>
          {invalidInput && <p className="red-text" >Please select at least one optional or required tag</p>}
          <button className="primary-btn" type="submit" >Save</button>
        </form>
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
export default Ideal