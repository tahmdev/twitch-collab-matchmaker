import { useEffect } from "react";
export default function useEventListener(type, callback, element, condition = true) {
  useEffect(() => {
    if(condition){
      let e = element.current || element
      e.addEventListener(type, callback)
      return () => e.removeEventListener(type, callback)
    }
  }, [callback])
}