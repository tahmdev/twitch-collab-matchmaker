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
  const openChat = (partner) => {
    fetch(`http://localhost:9000/chat/getHistory/${auth.sessionID}/${partner.id}`)
    .then(res => res.json())
    .then(json => setMessages(json))
    currentChatRef.current = partner
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