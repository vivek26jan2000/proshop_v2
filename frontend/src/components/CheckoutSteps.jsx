import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      {step1 ? (
        <Nav.Item>
          <LinkContainer to="/login">
            <Nav.Link>Sign In</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Nav.Link disabled>Sign In</Nav.Link>
        </Nav.Item>
      )}
      {step2 ? (
        <Nav.Item>
          <LinkContainer to="/shipping">
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Nav.Link disabled>Shipping</Nav.Link>
        </Nav.Item>
      )}
      {step3 ? (
        <Nav.Item>
          <LinkContainer to="/payment">
            <Nav.Link>Payment</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Nav.Link disabled>Payment</Nav.Link>
        </Nav.Item>
      )}
      {step4 ? (
        <Nav.Item>
          <LinkContainer to="/placeorder">
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Nav.Link disabled>Place Order</Nav.Link>
        </Nav.Item>
      )}
    </Nav>
  );
};

export default CheckoutSteps;
