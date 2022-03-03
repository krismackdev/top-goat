import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { GamesContextProvider } from '../src/store/games-context'

ReactDOM.render(
  <React.StrictMode>
    <GamesContextProvider>
      <App />
    </GamesContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
