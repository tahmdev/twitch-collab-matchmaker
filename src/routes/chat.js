import { useContext, useEffect, useState } from "react"
import ChatWindow from "../components/chatWindow"
import moment from "moment"
import { AuthContext, NotifContext } from "../App"
import { useLocation } from "react-router-dom"

const Chat = ({socket}) => {
  const auth = useContext(AuthContext)
  const location = useLocation()
  const {getNotifs} = useContext(NotifContext)
  let [chatPartners, setChatPartners] = useState()
  let [messages, setMessages] = useState()
  let [currentChat, setCurrentChat] = useState()

  useEffect(() => {
    fetch(`http://localhost:9000/chat/getChats/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setChatPartners(json)
    })
  }, [])

  useEffect(() => {
    socket.off("newMessage")
    socket.on("newMessage", msg => handleNewMessage(msg))
  }, [currentChat])

  const handleNewMessage = (msg) => {
    if(currentChat.id === msg.sentBy){
      setMessages(prev => [...prev, msg])
    }else{
      getNotifs()
    }
  }

  const openChat = (partner) => {
    fetch(`http://localhost:9000/chat/getHistory/${auth.sessionID}/${partner.id}`)
    .then(res => res.json())
    .then(json => {
      setMessages(json)
      getNotifs()
    })
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

  const unmatch = () => {
    setChatPartners(prev => prev.filter(i => i.id !== currentChat.id))
    fetch(`http://localhost:9000/match/unmatch/${auth.sessionID}/${currentChat.id}`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json' 
       },
    })
  }

  useEffect(() => {
    if(chatPartners){
      if(location.state !== null){
        openChat({
          id: location.state.data.sentBy,
          name: location.state.data.name,
          profilePicture: location.state.data.profilePicture
        })
      }
      else if(window.innerWidth >= 768) openChat(chatPartners[0])
      else handleBack()
    }
  }, [chatPartners])

  const handleBack = () => {
    setCurrentChat(null)
    setMessages(null)
  }

  return(
    <div className="chat-wrapper">
      <div className="container--full-width flex-row ">
        <div className="flex-column chat-partners">
          <ul>
            { 
              chatPartners &&
              chatPartners.map(partner => {
                return(
                  <li key={partner.id} >
                    <button className="open-chat-btn" key={partner.id} onClick={() => openChat(partner)}>
                      <img src={partner.profilePicture} />
                      <span className="fix-text" > {partner.name} </span>
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
            unmatch={unmatch}
            handleBack={handleBack}
          />
        }
      </div>
      
    </div>
  )
}
export default Chat