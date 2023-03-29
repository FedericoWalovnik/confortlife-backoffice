import React, { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useNavigate, useLocation } from 'react-router-dom'
import './Login.scss'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  let location = useLocation()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        navigate('/home')
      }
    })
  }, [location])

  const onLogin = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        navigate('/home')
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        setError('Usuario o contraseña incorrecta')
        console.log(errorCode, errorMessage)
      })
  }

  return (
    <>
      <main>
        <section>
          <div className="Login">
            <h2>Login</h2>
            <form className="Login__container">
              <div className="Login__inputs">
                <div className="Login__input">
                  <label htmlFor="email-address">
                    Email
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="Login__input">
                  <label htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    onChange={e =>
                      setPassword(e.target.value)
                    }
                  />
                </div>
              </div>

              <p className="Login__error">{error}</p>

              <div className="Login__action">
                <button
                  className="Login__button"
                  onClick={onLogin}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login
