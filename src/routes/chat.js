import { useEffect, useRef, useState } from "react"
import ChatWindow from "../components/chatWindow"

const Chat = ({socket, auth}) => {

  let [chatPartners, setChatPartners] = useState()
  let [messages, setMessages] = useState()
  let currentChatRef = useRef()
  useEffect(() => {
    fetch(`http://localhost:9000/chat/getChats/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => setChatPartners(json))

    socket.on("newMessage", msg => handleNewMessage(msg))
  }, [])

  const handleNewMessage = (msg) => {
    console.log(currentChatRef.current.id, msg.sentBy)
    if(currentChatRef.current.id === msg.sentBy){
      setMessages(prev => [...prev, msg])
    }else{
      console.log("new message from ", msg.sentBy)
    }
  }

  const openChat = (partner) => {
    fetch(`http://localhost:9000/chat/getHistory/${auth.sessionID}/${partner.id}`)
    .then(res => res.json())
    .then(json => setMessages(json))
    currentChatRef.current = partner
  }

  const sendMessage = (content) => {
    let msg = {
      sessionID: auth.sessionID,
      partnerID: currentChatRef.current.id,
      content: content
    }
    setMessages(prev => [...prev, msg])
    socket.emit("sendMessage", msg)
  }

      { 
        chatPartners &&
        chatPartners.map(partner => {
          return(
            <button key={partner.id} onClick={() => openChat(partner)}>
              {partner.name}
            </button>
          )
        })
      }
}
export default Chat