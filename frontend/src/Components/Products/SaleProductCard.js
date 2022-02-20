import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import './ProductCard.css'

export const SaleProductCard = ({ product }) => {
  var saleStartExp = moment(product.saleStartDate);
  var saleStartDuration = moment.duration(saleStartExp.diff(moment())).asMinutes();


  var saleEndExp = moment(product.saleEndDate);
  var saleEndDuration = moment.duration(saleEndExp.diff(moment())).asMinutes();
  return (
   product.salePrice && saleStartDuration < 0 && saleEndDuration > 0 &&
    <div className="m-2 product-card">
      <Link to={"/product/" + product._id}>
        <img
          src={
            product && product.productPictures && product.productPictures[0].img
          }
          alt={product.title}
          className="w-100"
          style={{ height: "323px" }}
        />
      </Link>
      <div className="desc mt-2">
        <p className="title">{product.title}</p>
        <p className="para" dangerouslySetInnerHTML={{ __html: product.description }}></p>
        <p><span className='text-decoration-line-through px-2'>Rs. {product.price} </span>   <span className="fw-bold text-success">Rs.{product.salePrice}</span></p>
      </div>
    </div>
  );
};
