import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBook} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const getNavLinkContainer = () => (
    <ul className="nav-link-container">
      <Link to="/">
        <li className="nav-link-item">Home</li>
      </Link>
      <Link to="/shelf">
        <li className="nav-link-item">Bookshelves</li>
      </Link>
      <li className="nav-link-item">
        <button type="button" onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </li>
    </ul>
  )

  const getMobileNavLinkContainer = () => (
    <ul className="sm-nav-link-container">
      <Link to="/">
        <li className="sm-nav-link-item">
          <AiFillHome className="sicon" />
        </li>
      </Link>
      <Link to="/shelf">
        <li className="sm-nav-link-item">
          <BsBook className="sicon" />
        </li>
      </Link>
      <li className="sm-nav-link-item">
        <button type="button" onClick={onLogout} className="sm-logout-btn">
          <FiLogOut className="sicon" />
        </button>
      </li>
    </ul>
  )

  const websiteLogo =
    'https://res.cloudinary.com/amjay/image/upload/v1687973956/Group_7731_xdkmqo.png'
  const websiteLogoAltText = 'website logo'

  return (
    <nav className="nav-bar">
      <Link to="/">
        <img
          className="website-logo"
          src={websiteLogo}
          alt={websiteLogoAltText}
        />
      </Link>
      {getMobileNavLinkContainer()}
      {getNavLinkContainer()}
    </nav>
  )
}

export default withRouter(Header)
