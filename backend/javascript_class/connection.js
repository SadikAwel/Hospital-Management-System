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

setTimeout(() => {
  //connection.end();
}, 3000);

export default connection;
