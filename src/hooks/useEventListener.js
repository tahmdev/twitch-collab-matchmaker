import { useEffect, useState } from "react";
export default function useEventListener(type, callback, element, condition = true, force) {
  let [forceEventListeners, setForceEventListeners] = useState(false)
  useEffect(() => {
    if(condition){
      let e = element.current || element
      e.addEventListener(type, callback)
      return () => e.removeEventListener(type, callback)
    }
  }, [callback])

  useEffect(() => {
    if(force){
      setForceEventListeners(true)
    }
  }, [element])
}
