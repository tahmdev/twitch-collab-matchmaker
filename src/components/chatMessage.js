import moment from "moment"
const ChatMessage = ({content, date, sentBy, auth}) => {

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