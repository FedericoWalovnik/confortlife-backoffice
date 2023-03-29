import React from 'react'
import './App.scss'
import Navbar from './components/Navbar/Navbar'

import Home from './views/Home/Home'
import Login from './views/Login/Login'

import { ThemeProvider } from '@mui/material/styles'

import theme from './material-theme'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/home"
              element={<Home />}
            />
            <Route
              path="/"
              element={<Login />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
