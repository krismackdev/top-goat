import React from 'react'
import './App.css'
import { Navbar } from './components'
import { GamePage, MatchPage } from './pages'
import { Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/games" element={<GamePage />} />
        <Route path="/matches" element={<MatchPage />} />
      </Routes>
    </>
  )
}

export default App
