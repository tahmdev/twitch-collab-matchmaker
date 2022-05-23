import { useEffect, useRef, useState } from "react"
import ChatWindow from "../components/chatWindow"

const Chat = ({socket, auth}) => {
  let [chatPartners, setChatPartners] = useState()
  useEffect(() => {
    fetch(`http://localhost:9000/chat/getChats/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => setChatPartners(json))

    socket.on("newMessage", msg => handleNewMessage(msg))
  }, [])
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