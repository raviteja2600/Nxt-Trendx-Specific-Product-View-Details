import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsData: '',
    similarProductsData: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, option)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProductDetailsData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }

      const updatedSimilarProductsData = data.similar_products.map(
        productData => ({
          id: productData.id,
          imageUrl: productData.image_url,
          title: productData.title,
          style: productData.style,
          price: productData.price,
          description: productData.description,
          brand: productData.brand,
          totalReviews: productData.total_reviews,
          rating: productData.rating,
          availability: productData.availability,
        }),
      )

      this.setState({
        productDetailsData: updatedProductDetailsData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickDecreaseButton = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onClickIncreaseButton = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderProductItemDetails = () => {
    const {productDetailsData, similarProductsData, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetailsData
    return (
      <>
        <Header />
        <div className="container">
          <div>
            <div className="product-item-details-container">
              <img src={imageUrl} alt="product" className="product-image" />
              <div className="details-container">
                <h1 className="title">{title}</h1>
                <p className="price">Rs {price}/-</p>
                <div className="rating-review-container">
                  <div className="rating-container">
                    <p className="rating">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                  <p className="review">{totalReviews} Reviews</p>
                </div>
                <p className="description">{description}</p>
                <p className="availability">
                  <span className="sub-heading">Available: </span>
                  {availability}
                </p>
                <p className="brand">
                  <span className="sub-heading">Brand: </span>
                  {brand}
                </p>
                <hr className="horizontal-line" />
                <div className="buttons-container">
                  <button
                    data-testid="plus"
                    type="button"
                    onClick={this.onClickDecreaseButton}
                    className="button"
                  >
                    <BsDashSquare />
                  </button>
                  <p className="count-value">{count}</p>
                  <button
                    data-testid="minus"
                    type="button"
                    onClick={this.onClickIncreaseButton}
                    className="button"
                  >
                    <BsPlusSquare />
                  </button>
                </div>
                <button type="button" className="add-to-cart-button">
                  ADD TO CART
                </button>
              </div>
            </div>
            <div className="similar-products-container">
              <h1 className="similar-products">Similar Products</h1>
              <ul className="lists-container">
                {similarProductsData.map(itemDetails => (
                  <SimilarProductItem
                    key={itemDetails.id}
                    itemDetails={itemDetails}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
    this.setState({
      apiStatus: apiStatusConstants.success,
    })
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view"
        />
        <h1 className="failure-view-heading">Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductsDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderProductsDetailsView()}</>
  }
}

export default ProductItemDetails
