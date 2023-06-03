import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={onSubmitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              value="PayPal"
              id="PayPal"
              checked
              name="paymentMethod"
              onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
