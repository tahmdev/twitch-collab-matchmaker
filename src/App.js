import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Profile from './routes/profile';

// Profile
// => gender should be radio buttons
// => age should be number input with min & max
// => tags, up to 10
// Looking for
// => Create profile of perfect partner
// => Age should be a range
// => Gender should be checkboxes
// Settings
// => Lightmode 
// => Delte account
// Match
// => Generate queue of matches
//  => Age & gender should be exact matches, tags should be the more the better + allow mandatory tags
// => On decline
//  => add to declined list 
// => On accept 
//  => add to accepted list
//    => Check if partners accepted list includes user 
//      => If true: add both to websocket room + send notification 
//      => else: check if user is on partners declined list
//        => if false: add  user to partners match queue

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
      </Routes>
    </div>
  );
}

export default App;
