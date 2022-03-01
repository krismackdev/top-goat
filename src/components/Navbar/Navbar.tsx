import React from 'react'
import './Navbar.css'
import images from '../../constants/images'

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
              <a href="#">Games</a>
            </li>
            <li>
              <a href="#">Matches</a>
            </li>
            <li>
              <a href="#">Players</a>
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
