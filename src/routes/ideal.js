import { useEffect, useState } from "react"
import Select from 'react-select'
import moment from "moment"
import MultiRange from "../components/multiRange"
import tagList from "../data/tagList"
const Ideal = ({auth}) => {
  let [isLoading, setIsLoading] = useState(true)
  let [partnerStatus, setPartnerStatus] = useState([])
  let [gender, setGender] = useState([])
  let [minAge, setMinAge] = useState(21)
  let [maxAge, setMaxAge] = useState(110)
  let [optionalTags, setOptionalTags] = useState([])
  let [requiredTags, setRequiredTags] = useState([])
  let [viewCount, setViewCount] = useState([])
  let [invalidInput, setInvalidInput] = useState(false)

  // Tags up to 5 nessecary, up to 5 nice to have
  // viewcount, more than me, less than me, around my level
  // 

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
      <form onSubmit={handleSubmit} >
        <label>
          <span>Twitch Partner Status</span>
          <Select 
            className="react-select"
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

        <label>
          <span>Gender: </span>
          <Select 
            className="react-select"
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

        <label>
          <span>Maxmimum Age:</span>
          <input type="number" min={13} max={120} value={maxAge} onChange={e => setMaxAge(e.target.value)}/>
        </label>

        <label>
          <span>Required Tags:</span>
          <Select 
            className="react-select"
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
            className="react-select"
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
            className="react-select"
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
        {invalidInput && <p>Please select at least one optional or required tag</p>}
        <button type="submit" >Save</button>
      </form>
    </div>
  )
}
export default Ideal