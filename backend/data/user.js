import bcryptjs from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: bcryptjs.hashSync("12345", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcryptjs.hashSync("12345", 10),
  },
  {
    name: "David",
    email: "david@example.com",
    password: bcryptjs.hashSync("12345", 10),
  },
];

export default users;
