import React, { useEffect } from "react";
import { Row, Col, ListGroup, Card, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        taxPrice: cart.taxPrice,
        itemsPrice: cart.itemsPrice,
        shippingAddress: cart.shippingAddress,
        totalPrice: cart.totalPrice,
        shippingPrice: cart.shippingPrice,
        user: userInfo._id,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/orders/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>
              <strong>Address:</strong> {cart.shippingAddress.address},
              {cart.shippingAddress.postalCode},{cart.shippingAddress.city},
              {cart.shippingAddress.country}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <strong>Method:</strong>
              {"  "}
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Order Items</h3>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => {
                  return (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            rounded
                            fluid
                            alt={item.name}
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col>
                          {`${item.qty}x${item.price} =  $ ${
                            item.price * item.qty
                          }`}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={1}></Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>ItemsPrice:</Col>
                  <Col>$ {cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>ShippingPrice:</Col>
                  <Col>$ {cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TaxPrice:</Col>
                  <Col>$ {cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TotalPrice:</Col>
                  <Col>$ {cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  {error && <Message variant="danger">{error}</Message>}
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={cart.cartItems.length === 0}
                      className="mt-2"
                      onClick={placeOrderHandler}>
                      Place Order
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
              {isLoading && <Loader />}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
