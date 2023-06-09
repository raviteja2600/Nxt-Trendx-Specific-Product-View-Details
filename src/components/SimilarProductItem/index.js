import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {imageUrl, title, brand, price, rating} = itemDetails

  return (
    <li className="list-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
