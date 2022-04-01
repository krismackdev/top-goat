import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {
  GamesContextProvider,
  MatchesContextProvider,
  PlayersContextProvider,
} from '../src/store'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GamesContextProvider>
        <PlayersContextProvider>
          <MatchesContextProvider>
            <App />
          </MatchesContextProvider>
        </PlayersContextProvider>
      </GamesContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
