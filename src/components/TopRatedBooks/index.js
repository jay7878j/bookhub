import {Component} from 'react'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class TopRatedBooks extends Component {
  state = {
    initial: apiStatusConstraints.initial,
    booksData: [],
  }

  componentDidMount() {
    this.getTopRatedBooksData()
  }

  getTopRatedBooksData = async () => {
    this.setState({apiStatus: apiStatusConstraints.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
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

      // Converting snake_case formate to camelCase formate
      const foramtedData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      // console.log(foramtedData);

      this.setState({
        apiStatus: apiStatusConstraints.success,
        booksData: foramtedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onTryAgainBtn = () => {
    this.getTopRatedBooksData()
  }

  getCarouselContainer = () => {
    const {booksData} = this.state
    const settings = {
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
      cssEase: 'linear',
      pauseOnHover: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings}>
        {booksData.map(eachLogo => {
          const {id, coverPic, authorName, title} = eachLogo
          return (
            <Link to={`/books/${id}`} key={id}>
              <div className="slick-item">
                <img className="top-rated-img" src={coverPic} alt={title} />
                <h1 className="top-rated-title">{title}</h1>
                <p className="top-rated-author-name">{authorName}</p>
              </div>
            </Link>
          )
        })}
      </Slider>
    )
  }

  onFindBooks = () => {
    const {history} = this.props
    history.replace('/shelf')
  }

  // Render Success View
  renderSuccessView = () => (
    <>
      <div className="top-section">
        <div className="top-rated-content-conatainer">
          <h1 className="top-rated-heading">Find Your Next Favorite Books?</h1>
          <p className="top-rated-description">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <button
            type="button"
            onClick={this.onFindBooks}
            className="sm-find-books-btn"
          >
            Find Books
          </button>
        </div>
        <div className="carousel-container">
          <div className="carousel-heading-container">
            <h1 className="heading">Top Rated Books</h1>
            <button
              type="button"
              className="md-find-books-btn"
              onClick={this.onFindBooks}
            >
              Find Books
            </button>
          </div>
          <div className="slick-container">{this.getCarouselContainer()}</div>
        </div>
      </div>
      <div className="contact-container">
        <div className="social-icons-container">
          <FaGoogle className="social-icon" />
          <FaTwitter className="social-icon" />
          <FaInstagram className="social-icon" />
          <FaYoutube className="social-icon" />
        </div>
        <p>Contact Us</p>
      </div>
    </>
  )

  // Render Loading View
  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  // Render Failure View
  renderFailureView = () => {
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
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="try-again-btn"
          onClick={this.onTryAgainBtn}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Get Render Views
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

  render() {
    return (
      <div className="main-top-rated-book-container">
        {this.getRenderViews()}
      </div>
    )
  }
}

export default withRouter(TopRatedBooks)
