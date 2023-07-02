import {Component} from 'react'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import {AiFillStar} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    bookDetails: {},
  }

  componentDidMount() {
    this.getBookItemDetails()
  }

  getBookItemDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken);
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id);
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    // console.log(response);
    if (response.ok) {
      const data = await response.json()
      // console.log(data);
      const formatBookDetails = {
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        readStatus: data.book_details.read_status,
        id: data.book_details.id,
        title: data.book_details.title,
        rating: data.book_details.rating,
      }
      console.log(formatBookDetails)

      this.setState({
        bookDetails: formatBookDetails,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  getTopSection = () => {
    const {bookDetails} = this.state
    const {title, coverPic, authorName, readStatus, rating} = bookDetails

    return (
      <div className="book-details-top-section">
        <img className="book-img" src={coverPic} alt="" />
        <div className="jay">
          <h1 className="book-details-title">{title}</h1>
          <p className="book-author-name">{authorName}</p>
          <div className="rating-container book-rating">
            <span className="rating">Avg. Rating </span>
            <AiFillStar className="rating-icon" />
            <span className="rating">{rating}</span>
          </div>
          <div className="read-status book-rating">
            <p className="status-para">
              Status : <span className="status"> {readStatus}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  getBottomSection = () => {
    const {bookDetails} = this.state
    const {aboutAuthor, aboutBook} = bookDetails

    return (
      <div className="bottom-section">
        <div className="content">
          <h1 className="bottom-heading">About Author</h1>
          <p className="content-para">{aboutAuthor}</p>
        </div>
        <div className="content">
          <h1 className="bottom-heading">About Book</h1>
          <p className="content-para">{aboutBook}</p>
        </div>
      </div>
    )
  }

  renderSuccessView = () => (
    <div className="main-book-details-container">
      <div className="book-details-card">
        {this.getTopSection()}
        <hr />
        {this.getBottomSection()}
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
  )

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
        <h1 className="failre-view-heading">
          Something went wrong, Please try again.
        </h1>
        <button type="button" className="try-again-btn" onClick={onTryAgainBtn}>
          Try Again
        </button>
      </div>
    )
  }

  getRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConst.inProgress:
        return this.renderLoadingView()

      case apiStatusConst.success:
        return this.renderSuccessView()

      case apiStatusConst.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.getRenderViews()}
      </>
    )
  }
}
export default BookItemDetails
