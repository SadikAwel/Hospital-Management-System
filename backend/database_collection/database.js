import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_Host,
    user: process.env.MYSQL_ROOT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getUsersInfo(type) {
  const [result] = await pool.query("SELECT * FROM user WHERE userType = ?", [type]);
  return result;
}

export async function getUserInfo(id) {
  const [result] = await pool.query(
    `
    SELECT *
    FROM user
    WHERE
    userId = ?`,
    [id]
  );
  return result;
}

export async function updataPatientHistory(patient, pool) {
  sql = `INSERT INTO Patient (medicalHistory) value (?)`;
  await pool.query(sql, [patient.medicalHistory]);
  return "patient history is updated";
}

export async function updatamedicine(patient, pool) {
  sql = `INSERT INTO Patient (medicine) value (?)`;
  await pool.query(sql, [patientMedicine]);
  return "patient history is updated";
}

export function createNewUser(patient, callback) {
  const sql = `INSERT INTO User (firstName, LastName, age, email, phoneNumber, password, userType)
                  VALUES (?, ?, ?, ?, ?, ?)`;
  pool.query(
    sql,
    [
      patient.firstName,
      patient.lastName,
      patient.age,
      patient.email,
      patient.phoneNumber,
      patient.getPassword(),
      patient.userType,
    ],
    (err, result) => {
      if (err) {
        console.log("you get error when you insert");
        callback(err);
      } else {
        callback(null, "successfully completed !");
      }
    }
  );
}
