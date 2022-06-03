import moment from "moment"
import { useContext } from "react"
import { AuthContext } from "../App"
const ChatMessage = ({content, date, sentBy}) => {
  const auth = useContext(AuthContext)

  return(
    <div className={`chat-message ${Number(auth.id) === Number(sentBy) ? "user-message" : ""}`} >
      <p className="linebreak">
        {content}
      </p>
      <span className="message-time">
          {` ${moment(`${date}`).format("HH:mm")}`}
        </span> 
    </div>
  )
}
export default ChatMessage