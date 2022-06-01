import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import io from "socket.io-client";

import { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Profile from './routes/profile';
import Ideal from './routes/ideal';
import Match from './routes/match';
import Chat from './routes/chat';
const ENDPOINT = "http://localhost:9000/";
const socket = io(ENDPOINT)
// Match
// => On accept 
//  => add to accepted list
//    => Check if partners accepted list includes user 
//      => If true: add both to websocket room + send notification 
//      => else: check if user is on partners declined list
//        => if false: add  user to partners match queue

// Settings
// => Lightmode 
// => Delte account

// Backend
// Generate new sessionID until found one that is unique
// Also allow multiple sessionIDs
// Create ideal entry on first login
// birthday-input: Only show error message if not focused 

function App() {
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
  }, [])

  if(!auth){
    return(
      <div className='landing-background'>
        <div className='landing-wrapper flex-column container'>
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
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route path="/profile" element={ <Profile auth={auth} /> } />
        <Route path="/ideal" element={ <Ideal auth={auth} /> } />
        <Route path="/match" element={ <Match auth={auth} /> } />
        <Route path="/chat" element={ <Chat auth={auth} socket={socket} /> } />
      </Routes>
    </div>
  );
}

export default App;
