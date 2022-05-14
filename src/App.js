import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Profile from './routes/profile';

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
