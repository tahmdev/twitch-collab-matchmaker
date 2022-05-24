import { useEffect, useState } from "react"
import ChatMessage from "./chatMessage"

const ChatWindow = ({messages, sendMessage, partner, handleBack, auth}) => {
  let [currentInput, setCurrentInput] = useState("")

  const resizeTextarea = () => {
    let el = document.getElementById("chat-textarea")
    el.style.height = `Calc(1.2rem)`
    el.style.height = `Calc(${el.scrollHeight}px - 1rem)`
  }

  useEffect(() => {
    let el = document.getElementById("chat-textarea")
    el.addEventListener("input", resizeTextarea)
    return(() => el.removeEventListener("input", resizeTextarea))
  }, [resizeTextarea])

  const handleSend = () => {
    sendMessage(currentInput)
    setCurrentInput("")
  }

  return(
    <div className="chat-window" >
      <div className="chat-header" >
        <button onClick={handleBack}>Back</button>
        <img src={partner.profilePicture} />
        <h1>{partner.name}</h1>
      </div>
      
      <div className="chat-messages" >
        <ul>
        {messages &&
          messages.map((msg, idx) => <ChatMessage
            key={idx}
            content={msg.content}
            sentBy={msg.sentBy}
            date={msg.sentDate}
          />)
        }
        </ul>
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