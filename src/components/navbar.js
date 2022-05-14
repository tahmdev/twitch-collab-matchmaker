import Cookies from 'js-cookie';

const Navbar = ({auth}) => {

  return(
    <nav>
      
      {!auth &&
      <a
        href="https://id.twitch.tv/oauth2/authorize?client_id=obvhzy0jyulcbijceoffcny9jlrlia&force_verify=true&redirect_uri=http://localhost:9000/auth/twitch/redirect&response_type=code&scope=user_read"
      >
        Connect With Twitch!
      </a>
      }

      
      {auth &&
        <>
          <button onClick={() => Cookies.remove("twitchMatchMakerauthCookie")}> Logout </button>
          <p> {auth.name} </p>
          <p> {auth.sessionID} </p>
          <img src={auth.profilePicture} />
        </>
      }
    </nav>
  )
}
export default Navbar