import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { GamesContextProvider } from '../src/store/games-context'
import { MatchesContextProvider } from '../src/store/matches-context'
import { PlayersContextProvider } from '../src/store/players-context'
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
