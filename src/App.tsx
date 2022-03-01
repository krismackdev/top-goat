import React from 'react'
import './App.css'
import { Navbar } from './components'
import { MatchPage } from './pages'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <MatchPage />
    </>
  )
}

export default App
