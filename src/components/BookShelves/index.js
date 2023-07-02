import {Component} from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import {BsFillStarFill} from 'react-icons/bs'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstraints = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookShelves extends Component {
  state = {
    apiStatus: apiStatusConstraints.initial,
    booksData: [],
    readStatus: bookshelvesList[0].value,
    searchInputValue: '',
  }

  componentDidMount() {
    this.getReadBooksData()
  }

  getReadBooksData = async () => {
    this.setState({apiStatus: apiStatusConstraints.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {readStatus, searchInputValue} = this.state

    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${readStatus}&search=${searchInputValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      // console.log(data);

      const formatData = data.books.map(eachBook => ({
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        readStatus: eachBook.read_status,
        id: eachBook.id,
        title: eachBook.title,
        rating: eachBook.rating,
      }))

      // console.log(formatData);

      this.setState({
        booksData: formatData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  bookContainer = eachBook => {
    const {id, title, authorName, coverPic, rating, readStatus} = eachBook

    return (
      <Link to={`/books/${id}`} className="book-container" key={id}>
        <li className="book-container-item">
          <img className="book-img" src={coverPic} alt={title} />
          <div className="book-info-container">
            <h1 className="book-title-heading">{title}</h1>
            <p className="book-author-name">{authorName}</p>
            <div className="rating-container">
              <p className="rating">Avg Rating </p>
              <BsFillStarFill className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
            <div className="read-status">
              <p className="status-para">
                Status : <span className="status"> {readStatus}</span>
              </p>
            </div>
          </div>
        </li>
      </Link>
    )
  }

  // Render Loading View
  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  // Render Failure View
  renderFailureView = () => {
    const onTryAgainBtn = () => {
      this.getReadBooksData()
    }

    const failureViewImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973957/Group_7522_n3zo28.png'

    return (
      <div className="failure-view-container">
        <img
          className="failure-view-img"
          src={failureViewImg}
          alt="failure view"
        />
        <p className="failre-view-heading">
          Something went wrong, Please try again.
        </p>
        <button type="button" className="try-again-btn" onClick={onTryAgainBtn}>
          Try Again
        </button>
      </div>
    )
  }

  noSearchResultsContainer = () => {
    const {searchInputValue} = this.state
    const noResultsImg =
      'https://res.cloudinary.com/amjay/image/upload/v1687973957/Asset_1_1_vgok8k.png'
    const noResultsAltText = 'no books'

    return (
      <div className="no-search-results">
        <img
          className="no-results-img"
          src={noResultsImg}
          alt={noResultsAltText}
        />
        <h1 className="no-results-heading">
          Your search for
          <span className="user-search-value"> {searchInputValue} </span>did not
          find any matches.
        </h1>
      </div>
    )
  }

  renderSuccessView = () => {
    const {booksData} = this.state

    if (booksData.length === 0) {
      return this.noSearchResultsContainer()
    }

    return (
      <ul className="books-list-container">
        {booksData.map(eachBook => this.bookContainer(eachBook))}
      </ul>
    )
  }

  getRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.in_progress:
        return this.renderLoadingView()

      case apiStatusConstraints.success:
        return this.renderSuccessView()

      case apiStatusConstraints.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  getReadStatusBtnContainer = () => {
    const onReadStatusUpdate = value => {
      this.setState({readStatus: value}, this.getReadBooksData)
    }

    return (
      <div className="read-status-container">
        <h1 className="bookshelves-heading"> Bookshelves </h1>
        <ul className="read-status-container1">
          {bookshelvesList.map(eachItem => {
            const {id, value, label} = eachItem

            const onReadStatusBtnClick = () => {
              onReadStatusUpdate(value)
            }

            return (
              <li className="read-status-list-item" key={id}>
                <button
                  type="button"
                  className="read-status-btn"
                  onClick={onReadStatusBtnClick}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  onsearchBtnClick = () => {
    this.getReadBooksData()
  }

  onUserSearch = Event => {
    this.setState({searchInputValue: Event.target.value})
  }

  onEnterPress = Event => {
    if (Event.key === 'Enter') {
      this.getReadBooksData()
    }
  }

  getInputSearchContainer = () => (
    <div className="input-search-container">
      <input
        type="search"
        className="search-bar"
        onChange={this.onUserSearch}
        placeholder="Search"
        onKeyDown={this.onEnterPress}
      />
      <button
        type="button"
        className="search-btn"
        onClick={this.onsearchBtnClick}
        testid="searchButton"
      >
        <BiSearchAlt2 className="search-icon" />
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="main-bookshelf-container">
          <div className="books-card">
            <div className="left-section">
              <div className="sm-search-input-container">
                {this.getInputSearchContainer()}
              </div>
              {this.getReadStatusBtnContainer()}
            </div>
            <div className="right-section">
              <div className="section1">
                <div className="md-search-container">
                  <h1 className="md-search-book-heading">All Books</h1>
                  {this.getInputSearchContainer()}
                </div>
                {this.getRenderViews()}
              </div>
              <div className="book-contact-container">
                <div className="social-icons-container">
                  <FaGoogle className="social-icon" />
                  <FaTwitter className="social-icon" />
                  <FaInstagram className="social-icon" />
                  <FaYoutube className="social-icon" />
                </div>
                <p>Contact Us</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default BookShelves
