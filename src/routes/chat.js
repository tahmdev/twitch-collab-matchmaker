import { useEffect, useRef, useState } from "react"
import ChatWindow from "../components/chatWindow"
import moment from "moment"

const Chat = ({socket, auth}) => {

  let [chatPartners, setChatPartners] = useState()
  let [messages, setMessages] = useState()
  let [currentChat, setCurrentChat] = useState()

  useEffect(() => {
    fetch(`http://localhost:9000/chat/getChats/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => setChatPartners(json))
  }, [])

  useEffect(() => {
    console.log(socket)
    if(currentChat) console.log("BBBBB" + currentChat.id)
    socket.off("newMessage")
    socket.on("newMessage", msg => handleNewMessage(msg))
  }, [currentChat])

  const handleNewMessage = (msg) => {
    if(currentChat.id === msg.sentBy){
      setMessages(prev => [...prev, msg])
    }else{
      console.log("new message from ", msg.sentBy)
    }
  }

  const openChat = (partner) => {
    fetch(`http://localhost:9000/chat/getHistory/${auth.sessionID}/${partner.id}`)
    .then(res => res.json())
    .then(json => setMessages(json))
    setCurrentChat(partner)
  }

  const sendMessage = (content) => {
    let data = {
      sessionID: auth.sessionID,
      partnerID: currentChat.id,
      content: content
    }
    setMessages(prev => [...prev, {
      content: content,
      sentBy: auth.id, 
      sentDate: moment(new Date()).toISOString()
    }])
    socket.emit("sendMessage", data)
  }

  return(
    <div className="chat-wrapper">
      <div className="flex-column">
        <ul>
          { 
            chatPartners &&
            chatPartners.map(partner => {
              return(
                <li key={partner.id} >
                  <button className="open-chat-btn" key={partner.id} onClick={() => openChat(partner)}>
                    <img src={partner.profilePicture} />
                    <span> {partner.name} </span>
                  </button>
                </li>
              )
            })
          }
        </ul>

      </div>
      {
        currentChat &&
        <ChatWindow 
          sendMessage={sendMessage} 
          messages={messages} 
          partner={currentChat} 
          handleBack={handleBack}
          currentChat={currentChat}
        />
      }
    </div>
  )
}
export default Chat