import User from "./User.js";

export class Patient extends User {
  constructor(firstName, lastName, age, email, phoneNumber, password, userType) {
    super({ firstName, lastName, age, email, phoneNumber, password, userType });
    this.id = 3; // Useful for queries
  }

  static createIfValid(firstName, lastName, age, email, phoneNumber, password) {
    if (!firstName || !email || !password) {
      throw new Error("Please fill the blank space.");
    }
    return new Patient(firstName, lastName, age, email, phoneNumber, password, "Patient");
  }

  static async getPatientDetail(pool, PatientID) {
    const sql = `SELECT PatientID, FirstName, LastName, DOB, Email, ContactNumber FROM patients WHERE PatientID = ?`;
    const [rows] = await pool.query(sql, [PatientID]);

    if (rows.length === 0) return null;

    const row = rows[0];
    const patient = new Patient(
      row.FirstName,
      row.LastName,
      row.DOB,
      row.Email,
      row.ContactNumber,
      "11111",
      "Patient"
    );

    return patient;
  }

  async getMedicalRecord(pool) {
    const sql = `SELECT Diagnosis, Treatment, Prescription, LabResults, DoctorID FROM medicalrecords WHERE PatientID = ?`;
    const [value] = await pool.query(sql, [this.id]);
    return value;
  }

  async addMedicalHistory(pool, Diagnosis, Treatment, Prescription, LabResults, DoctorID) {
    const sql = `INSERT INTO medicalrecords (PatientID, Diagnosis, Treatment, Prescription, LabResults, DoctorID) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.query(sql, [this.id, Diagnosis, Treatment, Prescription, LabResults, DoctorID]);
    return "Saved";
  }

  async getDoctorAppointment(pool, DoctorID, AppointmentDate, note) {
    const sql = `INSERT INTO appointments (PatientID, DoctorID, AppointmentDate, note) VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [this.id, DoctorID, AppointmentDate, note]);
    return "Appointment added";
  }

  async addLabTest(pool, LabTestID, DoctorID, Result, TestDate) {
    const sql = `INSERT INTO labresults (PatientID, LabTestID, DoctorID, Result, TestDate) VALUES (?, ?, ?, ?, ?)`;
    await pool.query(sql, [this.id, LabTestID, DoctorID, Result, TestDate]);
    return "Saved";
  }

  async getLabTest(pool) {
    const sql = `SELECT LabTestID, DoctorID, Result, TestDate FROM labresults WHERE PatientID = ?`;
    const [value] = await pool.query(sql, [this.id]);
    return value;
  }

  async payBill(pool, Amount, PaymentStatus, InsuranceClaimed, DateIssued) {
    if (!Amount || !InsuranceClaimed) return "Please fill the blank space";

    const sql = `INSERT INTO billing (PatientID, Amount, PaymentStatus, InsuranceClaimed, DateIssued) VALUES (?, ?, ?, ?, ?)`;
    await pool.query(sql, [this.id, Amount, PaymentStatus, InsuranceClaimed, DateIssued]);
    return "Successfully paid";
  }

  async showBillStatus(pool) {
    const sql = `SELECT * FROM billing WHERE PatientID = ?`;
    const [value] = await pool.query(sql, [this.id]);
    return value;
  }
}
export default Patient;
