import React from 'react'
import './App.css'
import VideoPlayer from './Components/VideoPlayer'
import Auth from './Components/Auth'
import { UserProvider } from './context/UserContext'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <UserProvider>
    <div className="app">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/video" element={<VideoPlayer />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
    </UserProvider>
  )
}

export default App
