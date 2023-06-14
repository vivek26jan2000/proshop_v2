import React, { useEffect } from "react";
import Loader from "../components/Loader";
import { Row, Col, ListGroup, Card, Image, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useUpdateDeliverStatusMutation,
} from "../slices/ordersApiSlice";
import { useParams, Link } from "react-router-dom";
import Message from "../components/Message";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [updateDeliverStatus, { isLoading: loadingDeliverStatus }] =
    useUpdateDeliverStatusMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("payment successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };
  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("payment successfully");
  };
  const onError = (err) => {
    toast.error(err.message);
  };
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => orderId);
  };

  const deliveredStatusHandler = async () => {
    try {
      await updateDeliverStatus(orderId).unwrap();
      toast.success("Delivery status change successfully");
      refetch();
    } catch (err) {
      console.log(err.data.message);
      toast.error(err?.data.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h2>OrderId: {order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Name:</strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address:</strong>
                {"  "}
                {order.shippingAddress.address},
                {order.shippingAddress.postalCode},{order.shippingAddress.city},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">{`Your Order is Delivered on ${order.deliveredAt}`}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">{`Paid on ${order.paidAt}`}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              <ListGroup>
                {order.orderItems.map((item) => {
                  return (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={1}>
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
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>ItemsPrice:</Col>
                  <Col>$ {order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>ShippingPrice:</Col>
                  <Col>$ {order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>TaxPrice:</Col>
                  <Col>$ {order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>TotalPrice:</Col>
                  <Col>$ {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <div>
                        <Row>
                          <Col className="text-center">
                            <Button
                              className="btn-block my-2"
                              onClick={onApproveTest}>
                              Test Pay Order
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {order.isPaid &&
                !order.isDelivered &&
                userInfo &&
                userInfo.isAdmin && (
                  <>
                    {loadingDeliverStatus ? (
                      <Loader />
                    ) : (
                      <ListGroup.Item className="text-center">
                        <Button
                          type="button"
                          variant="primary"
                          className="btn-block"
                          onClick={deliveredStatusHandler}>
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                  </>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
