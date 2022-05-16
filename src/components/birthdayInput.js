import Select from 'react-select'
import moment from "moment"
import { useEffect, useState } from "react"

const BirthdayInput = ({minimumAge, callback, initial}) => {
  let [day, setDay] = useState(moment(initial).format("DD"))
  let [month, setMonth] = useState(() => {
    switch(moment(initial).format("MM")){
      case "01":
        return {value: 1, label: "January"}
      case "02":
        return {value: 2, label: "February"}
      case "03":
        return {value: 3, label: "March"}
      case "04":
        return {value: 4, label: "Apri"}
      case "05":
        return {value: 5, label: "May"}
      case "06":
        return {value: 6, label: "June"}
      case "07":
        return {value: 7, label: "July"}
      case "08":
        return {value: 8, label: "August"}
      case "09":
        return {value: 9, label: "September"}
      case "10":
        return {value: 10, label: "October"}
      case "11":
        return {value: 11, label: "November"}
      case "11":
        return {value: 12, label: "December"}
    }
  })
  let [year, setYear] = useState(moment(initial).format("YYYY"))
  let [validDate, setValidDate] = useState(false)

  const padZeros = (number, length, pos) => {
    let result = String(number)
    while(result.length < length){
      pos === "back"
      ? result = result + "0"
      : result = "0" + result
    }
    return result
  }

  useEffect(() => {
    let minimumBirthday = moment().subtract(minimumAge || 0, "years").format("YYYY-MM-DD");
    let date = moment(`${year}-${padZeros(month.value, 2)}-${padZeros(day, 2)}`, "YYYY-MM-DD", true)
    
    let dateIsValid = date.isBefore(minimumBirthday) && date.isValid()
    setValidDate(dateIsValid)
    callback(date.format("YYYY-MM-DD HH:mm:ss"), dateIsValid)
  }, [day, month, year])

  const maxYear = moment().subtract(minimumAge, "years").format("YYYY")
  return(
    <div>
      <div className="flex-row" >
        <label>
        <span>Month:</span>
        <Select
          id = "month"
          value={month}
          onChange={setMonth}
          placeholder="Month"
          options={
            [
              {value: 1, label: "January"},
              {value: 2, label: "February"},
              {value: 3, label: "March"},
              {value: 4, label: "April"},
              {value: 5, label: "May"},
              {value: 6, label: "June"},
              {value: 7, label: "July"},
              {value: 8, label: "August"},
              {value: 9, label: "September"},
              {value: 10, label: "October"},
              {value: 11, label: "November"},
              {value: 12, label: "December"},
            ]
          } 
        />
        </label>
        <label>
          <span>Day:</span>
          <input id="day" type="number" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} />
        </label>
        <label>
          <span>Year:</span>
          <input id="year" type="number" min={1900} max={maxYear} value={year} onChange={e => setYear(e.target.value)} />
        </label>
      </div>
      <p style={{display: validDate ? "none" : "block"}} > Please enter a valid date </p>
    </div>
  )
}
export default BirthdayInput