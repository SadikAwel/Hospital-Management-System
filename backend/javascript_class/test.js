import Patient from "./Patient.js";
import Staff from "./Staff.js";
import User from "./User.js";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "(Sadik3935)",
  database: "zewditu_pms",
});

// Create a new staff (e.g., a doctor)
const newStaff = new Staff({
  firstName: "Dr. Alice",
  lastName: "Smith",
  age: 40,
  email: "alice.smith@gmail.com",
  phoneNumber: "987654321",
  password: "doctorpassword",
  userType: "Doctor",
}).saveStaff(connection);

// Using async/await for queries
const [rows, fields] = await connection.query("SELECT * FROM Patients WHERE PatientID = ?", [3]);
console.log(rows[0].ContactNumber);

// Don't forget to close the connection when done

// Create a new patient
const newPatient = Patient.createIfValid(
  "John",
  "Doe",
  30,
  "john.doe@example.com",
  "123456789",
  "password123"
);
// console.log(newPatient.displayInfo());

// console.log(newStaff.displayInfo());

// Simulate patient and staff interaction (e.g., staff viewing patient info)
(async () => {
  try {
    // Simulate getting patient details
    const newStaff = await Staff.self(connection, 2);
    console.log(newStaff);
    const patientDetails = await newStaff.showPatientProfile(connection, 2);
    console.error("you reach in hear");
    console.log(patientDetails);
  } catch (error) {
    console.error(error.message);
  }
})();
setTimeout(() => {
  connection.end();
}, 3000);

export default connection;
