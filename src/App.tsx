import React from 'react'
import './App.css'
import { Navbar } from './components'
import { GamesPage } from './pages'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <GamesPage />
    </>
  )
}

export default App
