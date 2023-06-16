import React from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, refetch, error } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to Create new Product")) {
      try {
        await createProduct().unwrap();
        refetch();
        toast.success("Product Created Successfully");
      } catch (err) {
        toast.error(err?.data.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        toast.success("product deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-end">
          <Button
            type="button"
            variant="primary"
            className="btn-sm mx-2"
            onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      <Row>
        <Col>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button className="btn-sm" variant="light">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        className="btn-sm mx-3"
                        variant="light"
                        onClick={() => deleteHandler(product._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
        <Paginate page={data?.page} pages={data?.pages} isAdmin={true} />
      </Row>
    </>
  );
};

export default ProductListScreen;
