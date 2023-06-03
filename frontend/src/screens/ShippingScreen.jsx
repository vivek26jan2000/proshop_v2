import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
    dispatch(saveShippingAddress({ city, address, country, postalCode }));
    navigate("/payment");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="postalCode" className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="country" className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
