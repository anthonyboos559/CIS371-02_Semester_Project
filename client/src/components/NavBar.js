import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const location = useLocation(); 

    useEffect(() => {
      if (document.cookie) {
        const cookies = document.cookie.split('=');
        if (cookies[0] === 'username') {
          setLoggedIn(true);
          setUsername(cookies[1]);
        }
        else {
          setLoggedIn(false);
        }
      }
      else {
        setLoggedIn(false);
      }
    }, [location]);

    return (
    <nav className="navbar navbar-light bg-light navbar-expand-sm">
      <div className="container d-flex justify-content-center">
        <img src="phishlogo.png" alt="" width="120" height="60"></img>
        <a className="navbar-brand" >Phish Stats</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/stats">Stats</Link>
            {loggedIn ? (
              <Link className="nav-link" to="/Profile">{username}</Link>
              ) : (
              <Link className="nav-link" to="/login">Login</Link>
              )
            }
            {loggedIn ? (
              <Link className="nav-link" to="/logout">Logout</Link>
            ) : (
              <Link className="nav-link" to="/signup">Sign Up</Link>
              )
            }
          </div>
        </div>
      </div>
    </nav>
    );
}

export default NavBar;