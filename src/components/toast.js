import { useEffect, useRef } from "react";

const Toast = ({arr, setArr, classes, autodelete, max}) => {
  const timer = useRef()

  useEffect(() => {
    if(max && arr.length > max){
      setArr(prev => prev.filter((i, idx) => idx !== 0))
    }
    else if(autodelete && arr.length > 0){
      if(timer.current) clearInterval(timer.current)
      timer.current = setInterval(() => {
        setArr(prev => prev.filter((i, idx) => idx !== 0))
      }, autodelete);
    }
    else if(timer.current){
      clearInterval(timer.current)
    }
  }, [arr])

  return(
    <div className={classes}>
      {
        arr.map((i, idx) => {
          return(
            <div key={idx} className={`toast-notif toast-notif--${i.type}`} >
              {i.text}
              <button
                className="close-toast-btn trans-btn"
                onClick={() => setArr(prev => prev.filter((j, jidx) => jidx !== idx))}
              >
                x
              </button>
            </div>
          )
        })
      }
    </div>
  )
}
export default Toast