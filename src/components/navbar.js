import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import useLocalstorage from '../hooks/useLocalStorage';
import { Link, useNavigate } from 'react-router-dom';
import PopupButton from './popup-button';
import { faUser, faArrowRightFromBracket, faGear, faHeart, faMessage  } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import Popup from './popup';
import Switch from './switch';

const Navbar = ({auth, setAuth}) => {
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showSettingsPopup, setShowSettingsPopup] = useState(false)
  const [lightmode, setLightmode] = useLocalstorage("lightmode", false)
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
      onClick: () => {setShowSettingsPopup(true); setShowUserPopup(false)},
    },
    {
      name: "Logout",
      icon: faArrowRightFromBracket,
      role: "button",
      onClick: () => logout(),
    },
  ]

  useEffect(() => {
    let root = document.documentElement;
    if(lightmode){
      root.style.setProperty("--bg-100", "white")
      root.style.setProperty("--bg-200", "rgb(252, 252, 252)")
      root.style.setProperty("--bg-250", "rgb(233, 233, 233)")
      root.style.setProperty("--bg-300", "rgb(218, 218, 218)")
      root.style.setProperty("--bg-400", "rgb(165, 165, 165)")
      root.style.setProperty("--primary-color-300", "rgb(117,46,228)")
      root.style.setProperty("--primary-color-600", "rgb(89, 131, 236)")
      root.style.setProperty("--text-color", "black")
      root.style.setProperty("--border-color", "rgba(0, 0, 0, 0.493)")
    }else{
      root.style.setProperty("--bg-100", "rgb(43, 43, 43)")
      root.style.setProperty("--bg-200", "rgb(70, 70, 70)")
      root.style.setProperty("--bg-250", "rgb(70, 70, 70)")
      root.style.setProperty("--bg-300", "rgb(122, 122, 122)")
      root.style.setProperty("--bg-400", "rgb(122, 122, 122)")
      root.style.setProperty("--primary-color-300", "rgb(144, 89, 231)")
      root.style.setProperty("--primary-color-600", "rgb(89, 248, 195)")
      root.style.setProperty("--text-color", "white")
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.493)")
    }
  }, [lightmode])

  return(
    <nav>
    {showSettingsPopup &&
      <Popup
        setShow={setShowSettingsPopup}
        classes={"settings-popup"}
      >
        <div className='settings'>
          <h2>Settings</h2>
          <ul>
            <li className='flex-row'>
              <span> Theme: </span>
              <Switch 
                id="lightmode" 
                checked={lightmode} 
                onChange={e => setLightmode(e.target.checked)} 
                classes="lightmode-switch"
              />
            </li>
          </ul>
        </div>
      </Popup>
    }
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
                      <span className='fix-text'>{i.name}</span>
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