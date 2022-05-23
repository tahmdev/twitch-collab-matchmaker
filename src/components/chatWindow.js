import { useState } from "react"

const ChatWindow = ({socket, messages, sendMessage, partner}) => {
  let [currentInput, setCurrentInput] = useState("")

  return(
    <div>
      <h1>{partner.name}</h1>
      <ul>
      {messages &&
        messages.map((msg, idx) => <li key={idx}> {msg.content} </li>)
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