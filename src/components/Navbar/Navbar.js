import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../firebaseConfig'
import { signOut } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'

import './Navbar.scss'

const Navbar = () => {
  const navigate = useNavigate()
  let location = useLocation()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate('/')
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <h1 tabIndex="0">
          <Link to={'/home'}>Confort Life</Link>
        </h1>
      </div>
      {location.pathname === '/home' ? (
        <div className="navbar__actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <></>
      )}
    </nav>
  )
}

export default Navbar
