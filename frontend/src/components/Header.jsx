import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>
                <img src={logo} alt="ProShop" />
                ProShop
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <SearchBox />
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <FaShoppingCart /> Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <>
                    {userInfo.isAdmin && (
                      <NavDropdown title={userInfo.name} id="userName">
                        <LinkContainer to="/admin/orderList">
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/productList">
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/userList">
                          <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                    {!userInfo.isAdmin && (
                      <NavDropdown title={userInfo.name} id="userName">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaUser /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
