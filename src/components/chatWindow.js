import { useEffect, useRef, useState } from "react"
import ChatMessage from "./chatMessage"
import moment from "moment"

const ChatWindow = ({messages, sendMessage, partner, handleBack, auth}) => {
  let [currentInput, setCurrentInput] = useState("")
  let chatMessagesRef = useRef()
  let prevPartner = useRef()
  let prevMessagesHeight = useRef()

  useEffect(() => {
    let el = chatMessagesRef.current
    prevMessagesHeight.current = el.clientHeight
    if(prevPartner.current !== partner && messages){
      prevPartner.current = partner
      el.scrollTo(0, el.scrollHeight)
    }
    else if(el && el.scrollHeight - el.clientHeight + 25 < el.scrollTop + el.clientHeight){
      el.scrollTo(0, el.scrollHeight)
    }
  }, [messages])

  const resizeTextarea = () => {
    let el = document.getElementById("chat-textarea")
    let currentMessages = chatMessagesRef.current
    el.style.height = `1.2rem`
    el.style.height = `Calc(${el.scrollHeight}px - 1rem)`
    
    if(prevMessagesHeight.current !== currentMessages.clientHeight){
      let heightChange = currentMessages.clientHeight - prevMessagesHeight.current
      currentMessages.scrollTo(0, currentMessages.scrollTop - heightChange)
      prevMessagesHeight.current = currentMessages.clientHeight
    }
  }

  useEffect(() => {
    let el = document.getElementById("chat-textarea")
    el.addEventListener("input", resizeTextarea)
    return(() => el.removeEventListener("input", resizeTextarea))
  }, [resizeTextarea])

  const handleSend = () => {
    sendMessage(currentInput)
    setCurrentInput("")
    document.getElementById("chat-textarea").style.height = "1.2rem"
  }

  return(
    <div className="chat-window" >
      <div className="chat-header" >
        <button onClick={handleBack}>Back</button>
        <div className="partner-info" >
          <img src={partner.profilePicture} />
          <h1>{partner.name}</h1>
        </div>
        <button>Settings</button>
      </div>
      
      <div className="chat-messages" ref={chatMessagesRef} >
        {messages &&
          messages.map((msg, idx, arr) => {
            let renderDate
            if (idx === 0 || moment(`${msg.sentDate}`).format("DD MMMM YYYY") !==
                moment(`${arr[idx - 1].sentDate}`).format("DD MMMM YYYY")) renderDate = true
            return(
              <>
                { renderDate &&
                  <div className="message-date">
                    {moment(`${msg.sentDate}`).format("DD MMMM YYYY")}
                  </div>
                }
                <ChatMessage
                  key={idx}
                  content={msg.content}
                  sentBy={msg.sentBy}
                  date={msg.sentDate}
                  auth={auth}
                />
              </>
            )
          })
        }
      </div>

      <div className="chat-input" >
        <div className="chat-text-container" >
          <textarea
            id="chat-textarea" 
            onChange={e => setCurrentInput(e.target.value)} 
            value={currentInput} 
            placeholder={`Message`}
          />
        </div>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}
export default ChatWindow