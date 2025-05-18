import crypto from "crypto";

class User {
  #password;
  constructor({ firstName, lastName, age, email, phoneNumber, password, userType }) {
    if (new.target === User) {
      throw new Error("User is an abstract class and cannot be instantiated");
    }

    if (!firstName || !lastName || !age || !email || !phoneNumber || !password || !userType) {
      throw new Error("Please fill in all required fields");
    }

    try {
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
      this.email = this.validateEmail(email);
      this.phoneNumber = phoneNumber;
      this.#password = this.hashPassword(password);
      this.userType = userType;
    } catch (err) {
      console.error("Error during user creation:", err.message);
      throw err;
    }
  }

  async saveStaff(pool) {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.age ||
      !this.email ||
      !this.phoneNumber ||
      !this.#password ||
      !this.userType
    ) {
      throw new Error("All fields are required.");
    }

    const sql = `INSERT INTO staff (FirstName, LastName, Age, Email, ContactNumber, PasswordHash, userType) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [result] = await pool.query(sql, [
        this.firstName,
        this.lastName,
        this.age,
        this.email,
        this.phoneNumber,
        this.#password,
        this.userType,
      ]);

      // Optionally return the inserted staff ID (or other relevant info)
      this.id = result.insertId; // Assuming the DB has an auto-incrementing primary key
      console.log("Staff saved successfully with ID:", this.id);
      return this;
    } catch (error) {
      throw new Error("Failed to save staff: " + error.message);
    }
  }

  get userId() {
    return this._userId;
  }

  validateEmail(email) {
    try {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) throw new Error("Invalid email format");
      return email;
    } catch (err) {
      console.error("Email validation failed:", err.message);
      throw err;
    }
  }

  hashPassword(password) {
    try {
      return crypto.createHash("sha256").update(password).digest("hex");
    } catch (err) {
      console.error("Password hashing failed:", err.message);
      throw err;
    }
  }

  getPassword() {
    return this.#password;
  }

  updateDetails({ firstName, lastName, age, email, phoneNumber, password }) {
    try {
      if (firstName) this.firstName = firstName;
      if (lastName) this.lastName = lastName;
      if (age) this.age = age;
      if (email) this.email = this.validateEmail(email);
      if (phoneNumber) this.phoneNumber = phoneNumber;
      if (password) this.#password = this.hashPassword(password);
    } catch (err) {
      console.error("Failed to update user details:", err.message);
      throw err;
    }
  }

  async saveUser(pool) {
    try {
      let sql;
      if (this.userType === "Patient") {
        sql = `INSERT INTO Patients (firstName, lastName, age, email, ContactNumber, PasswordHash) VALUES (?, ?, ?, ?, ?, ?)`;
      } else {
        sql = `INSERT INTO Staff (firstName, lastName, age, email, ContactNumber, PasswordHash) VALUES (?, ?, ?, ?, ?, ?)`;
      }

      await pool.query(sql, [
        this.firstName,
        this.lastName,
        this.age,
        this.email,
        this.phoneNumber,
        this.#password,
      ]);
    } catch (err) {
      console.error("Database operation failed:", err.message);
      throw err;
    }
  }

  addPatientDetails() {
    // To be implemented
  }

  bookAppointment() {
    // To be implemented
  }
}

export default User;
