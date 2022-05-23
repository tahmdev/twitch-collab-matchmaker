import { useState } from "react"
import ChatMessage from "./chatMessage"

const ChatWindow = ({socket, messages, sendMessage, partner}) => {
  let [currentInput, setCurrentInput] = useState("")

  return(
    <div>
      <h1>{partner.name}</h1>
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

      <input 
        onChange={e => setCurrentInput(e.target.value)} 
        value={currentInput} 
        placeholder={`Send a message to ${partner.name}`}
      />
      <button onClick={() => sendMessage(currentInput)}>Send</button>
    </div>
  )
}
export default ChatWindow