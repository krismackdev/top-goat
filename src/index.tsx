import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { GamesContextProvider } from '../src/store/games-context'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GamesContextProvider>
        <App />
      </GamesContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
