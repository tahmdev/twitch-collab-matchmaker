import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import PopupButton from './popup-button';
import { faUser, faArrowRightFromBracket, faGear, faHeart, faMessage  } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

const Navbar = ({auth, setAuth}) => {
  const [showUserPopup, setShowUserPopup] = useState(false)
  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove("twitchMatchMakerauthCookie")
    setAuth(null)
    navigate("/")
  }

  const popup = [
    {
      name: "Profile",
      icon: faUser,
      role: "link",
      onClick: () => {navigate("/profile"); setShowUserPopup(false)},
    },
    {
      name: "Ideal",
      icon: faHeart,
      role: "link",
      onClick: () => {navigate("/ideal"); setShowUserPopup(false)},
    },
    {
      name: "Chat",
      icon: faMessage,
      role: "link",
      onClick: () => {navigate("/chat"); setShowUserPopup(false)},
    },
    {
      name: "Settings",
      icon: faGear,
      role: "button",
      onClick: () => {console.log("aa"); setShowUserPopup(false)},
    },
    {
      name: "Logout",
      icon: faArrowRightFromBracket,
      role: "button",
      onClick: () => logout(),
    },
  ]

  return(
    <nav>
     
      {auth &&
        <>
          <Link to="/match" >Match me</Link>
          <PopupButton
            classes={"trans-btn user-btn"}
            popupClasses={"user-popup"}
            show={showUserPopup}
            setShow={setShowUserPopup}
          >
            <div className='nav-user flex-row'>
              <p className='large-only' > {auth.name} </p>
              <img src={auth.profilePicture} />
            </div>

            <ul>
              {popup.map(i => {
                return(
                  <li key={i.name} >
                    <button onClick={i.onClick} role={i.role} >
                      <FontAwesomeIcon icon={i.icon} className="user-icon" />
                      <span>{i.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </PopupButton>
        </>
      }
    </nav>
  )
}
export default Navbar