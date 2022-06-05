import './App.css';
import Cookies from 'js-cookie';
import io from "socket.io-client";
import React from 'react';
import { useEffect, useState, createContext } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Profile from './routes/profile';
import Ideal from './routes/ideal';
import Match from './routes/match';
import Chat from './routes/chat';
const ENDPOINT = "http://localhost:9000/";
const socket = io(ENDPOINT)

export const AuthContext = createContext()
export const NotifContext = createContext()



function App() {
  let [notifs, setNotifs] = useState()
  let [auth, setAuth] = useState(() => {
    let cookie = Cookies.get("twitchMatchMakerauthCookie")
    if (cookie) return JSON.parse(cookie)
    else return null
  })

  useEffect(() => {
    socket.on("getUser", () => {
      if(auth){
        socket.emit("auth", auth.sessionID)
      }
    })
    socket.off("newMessage")
    socket.on("newMessage", () => getNotifs())
  }, [])

  useEffect(() => {
    if(auth){
      getNotifs()
    }
  }, [])

  const getNotifs = () => {
    fetch(`http://localhost:9000/chat/getNotifications/${auth.sessionID}`)
    .then(res => res.json())
    .then(json => {
      setNotifs(json)
    })
  }

  if(!auth){
    return(
      <div className='landing-background'>
        <div className='landing-wrapper flex-column'>
          <h1>
            Twitch matchmaker
          </h1>
          <a className='primary-btn'
            href="https://id.twitch.tv/oauth2/authorize?client_id=obvhzy0jyulcbijceoffcny9jlrlia&redirect_uri=http://localhost:9000/auth/twitch/redirect&response_type=code&scope=user_read"
          >
            Connect With Twitch
          </a>
          <p className='landing-subtitle' >Connect using your Twitch account and find your new favorite co-streamer today</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <NotifContext.Provider value={{notifs: notifs, getNotifs: getNotifs, setNotifs: setNotifs}}>
        <AuthContext.Provider value={auth}>
          <Navbar auth={auth} setAuth={setAuth} />
          <Routes>
            <Route path="/" element={<Navigate replace to="/match"/>} />
            <Route path="/profile" element={ <Profile auth={auth} /> } />
            <Route path="/ideal" element={ <Ideal auth={auth} /> } />
            <Route path="/match" element={ <Match auth={auth} /> } />
            <Route path="/chat" element={ <Chat auth={auth} socket={socket} /> } />
          </Routes>
        </AuthContext.Provider>
      </NotifContext.Provider>

    </div>
  );
}

export default App;
