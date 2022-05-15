import Select from 'react-select'
import moment from "moment"
import { useEffect, useState } from "react"

const BirthdayInput = ({minimumAge}) => {
  let [day, setDay] = useState(1)
  let [month, setMonth] = useState({value: 1, label: "January"})
  let [year, setYear] = useState(1900)
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
    let minimumBirthday = moment().subtract(minimumAge, "years").format("YYYY-MM-DD");
    let date = moment(`${year}-${padZeros(month.value, 2)}-${padZeros(day, 2)}`, "YYYY-MM-DD", true)
    setValidDate(date.isBefore(minimumBirthday) && date.isValid())
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