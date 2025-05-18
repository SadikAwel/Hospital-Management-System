import User from "./User.js";
import Patient from "./Patient.js";
import crypto from "crypto";
//const crypto = require("crypto");

class Staff extends User {
  constructor({ firstName, lastName, age, email, phoneNumber, password, userType }) {
    super({ firstName, lastName, age, email, phoneNumber, password, userType });
    this.userType = userType;
  }

  static async self(pool, id) {
    const sql = `SELECT StaffID, FirstName, LastName, Age, Email, ContactNumber,PasswordHash, userType FROM staff WHERE StaffID = ?`;
    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Staff({
      firstName: row.FirstName,
      lastName: row.LastName,
      age: row.Age,
      email: row.Email,
      phoneNumber: row.ContactNumber,
      password: row.PasswordHash,
      userType: row.userType,
    });
  }

  async addStaffData(pool, id, department, specialization, Username) {
    if (this.userType === "admin") {
      const sql = `UPDATE staff SET department = ?, specialization = ?, Username = ? WHERE StaffID = ?`;
      await pool.query(sql, [department, specialization, Username, id]);
      return "Saved !!";
    } else {
      return "You don't have permission to change this!";
    }
  }

  async showPatientProfile(pool, id) {
    const patient = await Patient.getPatientDetail(pool, id);
    if (this.userType == ("Doctor" || "doctor")) {
      return {
        firstname: patient.firstName,
        lastname: patient.lastName,
        age: patient.age,
        phoneNumber: patient.phoneNumber,
      };
    } else {
      throw new Error("You can't access this Patient file");
    }
  }

  async editDetails(pool, id, Diagnosis, Treatment, Prescription, LabResults, DoctorID) {
    const patient = await Patient.getPatientDetail(pool, id);

    if ((this.userType === "doctor" || this.userType === "Doctor") && patient instanceof Patient) {
      await patient.addMedicalHistory(pool, Diagnosis, Treatment, Prescription, LabResults, DoctorID);
    }
  }

  async updateAppointment(pool, id, DoctorID, AppointmentDate, note) {
    const patient = await Patient.getPatientDetail(pool, id);
    await patient.getDoctorAppointment(pool, DoctorID, AppointmentDate, note);
  }

  async displayBill(pool, id) {
    const sql = `
    SELECT 
      b.Amount, 
      b.PaymentStatus,  
      b.InsuranceClaimed, 
      b.DateIssued, 
      p.firstName AS PatientName
    FROM billing b
    JOIN patients p ON b.PatientID = p.PatientID
    WHERE b.PatientID = ?
  `;
    const [value] = await pool.query(sql, [id]);
    return value;
  }

  // import connection from "./connection.js";
  // const doctor = await Staff.self(connection, 2);
  // const patient = await doctor.showPatientProfile(connection, 2);
  // console.log(patient);

  static async login(pool, emailOrUsername, password) {
    const sql = `
      SELECT * FROM staff 
      WHERE Email = ? OR Username = ?
    `;

    const [rows] = await pool.query(sql, [emailOrUsername, emailOrUsername]);

    if (rows.length === 0) {
      return { success: false, message: "Staff not found" };
    }

    const staff = rows[0];

    const inputHash = crypto.createHash("sha256").update(password).digest("hex");

    if (inputHash !== staff.PasswordHash) {
      return { success: false, message: "Incorrect password" };
    }
    console.log("Staff row:", staff);
    console.log("Input hash:", inputHash);
    console.log("DB hash:", staff.PasswordHash);

    const value = {
      success: true,
      message: "Login successful",
      staff: new Staff({
        firstName: staff.FirstName,
        lastName: staff.LastName,
        age: staff.age,
        email: staff.Email,
        phoneNumber: staff.ContactNumber,
        password: staff.PasswordHash,
        userType: staff.userType,
      }),
    };
    console.log(value, value.success);
    return value;
  }
}
export default Staff;
