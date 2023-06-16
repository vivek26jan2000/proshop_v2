import React from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetTopProductQuery } from "../slices/productsApiSlice";
import Loader from "./Loader";
import Message from "./Message";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel className="mb-4">
      {products.map((product) => {
        return (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} fluid />
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name}(${product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default ProductCarousel;
