import React from "react";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });
  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className=" btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          {data.products.length === 0 && (
            <Message variant="danger">NO Product Found</Message>
          )}
          {data.products?.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}

      <Paginate
        page={data?.page}
        pages={data?.pages}
        keyword={keyword ? keyword : ""}
      />
    </>
  );
};

export default HomeScreen;
