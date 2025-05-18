import Staff from "./Staff.js";
import connection from "./connection.js";

const newStaff = new Staff({
  firstName: "Dr. Alice",
  lastName: "Smith",
  age: 40,
  email: "alice.smith@gmail.com",
  phoneNumber: "987654321",
  password: "doctorpassword",
  userType: "Doctor",
}).displayBill(connection, 1);

console.log(newStaff);
