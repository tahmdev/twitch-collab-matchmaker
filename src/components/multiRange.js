import { useEffect, useRef, useState } from "react"

const MultiRange = ({min, max, minVal, maxVal, onChange, id}) => {
  let [minValue, setMinValue] = useState(minVal)
  let [maxValue, setMaxValue] = useState(maxVal)
  let rangeRef = useRef()

  const getPercent = (percent, of) => {
    return Math.round(percent / of * 100)
  }

  useEffect(() => {
    onChange(Number(minValue), Number(maxValue))
    rangeRef.current.style.left = `${getPercent(minValue - min, max - min)}%`
    rangeRef.current.style.width = `${getPercent(maxValue - minValue, max - min)}%`
  }, [minValue, maxValue])

  return(
    <div id={id} className="multi-range">
      <input 
        className={`thumb ${minValue > max / 1.2 ? "z5" : "z4"}`}
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={e => {
          if(+e.target.value < +minValue || +e.target.value <= +maxValue){
            setMinValue(e.target.value)
          }
        }}
      />

      <input 
        className="thumb z4"
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={e => {
          if(+e.target.value > +maxValue || +e.target.value >= +minValue){
            setMaxValue(e.target.value)
          }
        }}
        />  

      <div className="slider">
        <div className="slider-track" />
        <div className="slider-range" ref={rangeRef} />
        <div className="slider-left-value"> {minValue} </div>
        <div className="slider-right-value"> {maxValue} </div>
      </div>
    </div>
  )
}
export default MultiRange