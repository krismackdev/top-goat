import React from 'react'
import './Navbar.css'
import images from '../../constants/images'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <>
      <header>
        <div className="header-left-side">
          <div className="header-image-container">
            <img src={images.logo} alt="logo" />
          </div>
          <h2>Top Goat</h2>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/games">Games</Link>
            </li>
            <li>
              <Link to="/matches">Matches</Link>
            </li>
            <li>
              <Link to="/players">Players</Link>
            </li>
            <li>
              <div className="header-image-container">
                <img src={images.avatar} alt="logo" />
              </div>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Navbar

//  last on right, avatar aka profile link
