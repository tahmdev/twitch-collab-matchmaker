import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Profile from './routes/profile';
import Ideal from './routes/ideal';
import Match from './routes/match';

// Clear matches on ideal change
// Match
// => On decline
//  => add to declined list 
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

function App() {
  let [auth, setAuth] = useState(() => {
    let cookie = Cookies.get("twitchMatchMakerauthCookie")
    if (cookie) return JSON.parse(cookie)
    else return null
  })
  return (
    <div className="App">
      <Navbar auth={auth} />
      <Routes>
        <Route path="/profile" element={ <Profile auth={auth} /> } />
        <Route path="/ideal" element={ <Ideal auth={auth} /> } />
        <Route path="/match" element={ <Match auth={auth} /> } />
      </Routes>
    </div>
  );
}

export default App;
