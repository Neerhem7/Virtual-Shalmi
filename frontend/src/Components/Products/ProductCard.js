import React from "react";
import { Link } from "react-router-dom";
import './ProductCard.css'

export const ProductCard = ({ product }) => {
  return (
    <>
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
          <p className="para" dangerouslySetInnerHTML={{__html: product.description}}></p>
        </div>
      </div>
    </>
  );
};
