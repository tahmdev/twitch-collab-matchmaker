import { useEffect, useRef, useState } from "react"
import ChatMessage from "./chatMessage"
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faArrowLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import PopupButton from "./popup-button"

const ChatWindow = ({messages, sendMessage, partner, unmatch, handleBack, auth}) => {
  let [currentInput, setCurrentInput] = useState("")
  let [showSettings, setShowSettings] = useState(false)
  let chatMessagesRef = useRef()
  let prevPartner = useRef()
  let prevMessagesHeight = useRef()

  // handles scrolling to bottom on new messagesm, if not scrolled up & initial opening
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

  const handleUnmatch = () => {
    unmatch()
  }

  return(
    <div className="chat-window" >
      <div className="chat-header" >
        <button className="trans-btn chat-back-btn" onClick={handleBack} aria-label="Close chat">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="partner-info" >
          <img src={partner.profilePicture} />
          <h1>{partner.name}</h1>
        </div>
        <PopupButton 
          classes="trans-btn chat-settings-btn" 
          aria-label="Settings"
          popupClasses={"user-popup"}
          show={showSettings}
          setShow={setShowSettings}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
          <div>
            <button onClick={handleUnmatch} className="trans-btn">
              Unmatch
            </button>
          </div>
        </PopupButton>
      </div>
      
      <div className="chat-messages" ref={chatMessagesRef} >
        {messages &&
          messages.map((msg, idx, arr) => {
            let renderDate
            if (idx === 0 || moment(`${msg.sentDate}`).format("DD MMMM YYYY") !==
                moment(`${arr[idx - 1].sentDate}`).format("DD MMMM YYYY")) renderDate = true
            return(
              <div key={idx} className="contents" >
                { renderDate &&
                  <div className="message-date">
                    {moment(`${msg.sentDate}`).format("DD MMMM YYYY")}
                  </div>
                }
                <ChatMessage
                  content={msg.content}
                  sentBy={msg.sentBy}
                  date={msg.sentDate}
                  auth={auth}
                />
              </div>
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
        <button className="send-message-btn" onClick={handleSend} aria-label="Send message">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  )
}
export default ChatWindow