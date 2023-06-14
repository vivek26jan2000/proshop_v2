import React from "react";
import { FaTimes, FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../slices/usersApiSlice";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetAllUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        toast.success("user deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h2 className="text-center my-4">All Users Lists</h2>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row className="justify-content-center">
          <Col className="text-center">
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ISADMIN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>

                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>

                    <td>
                      <LinkContainer to={`/admin/user/${user._id}/edit`}>
                        <Button className="btn-sm" variant="light">
                          <FaEdit />
                        </Button>
                      </LinkContainer>

                      <Button
                        className="btn-sm"
                        variant="light"
                        onClick={() => {
                          deleteHandler(user._id);
                        }}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UserListScreen;
