import express from "express";
import Staff from "../../javascript_class/Staff.js";
import connection from "../../javascript_class/connection.js";
import User from "../../javascript_class/User.js";
import Patient from "../../javascript_class/Patient.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
const router = express.Router();
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use("/", router);

// 🧪 Get staff profile (GET)
app.get("/staff/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const staff = await Staff.self(connection, id);
  if (!staff) return res.status(404).send("Staff not found");
  res.json(staff);
});

// 🧪 Add staff extra data (PUT)
app.put("/staff/:id/addData", async (req, res) => {
  const id = parseInt(req.params.id);
  const { department, specialization, username } = req.body;
  const staff = await Staff.self(connection, id);
  if (!staff) return res.status(404).send("Staff not found");

  try {
    const result = await staff.addStaffData(connection, id, department, specialization, username);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/staff/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const result = await Staff.login(connection, emailOrUsername, password);

    if (result.success) {
      res.status(200).json({ staff: result.staff });
    } else {
      res.status(401).json({ loginmessage: result.message });
    }
  } catch (error) {
    console.error("Login failed:", error); // ✅ this shows what's wrong in the console
    res.status(500).json({ message: "Server error aaaaa", error });
  }
});

app.get("/mypath/go/:Did/:Pid", async (req, res) => {
  let did = parseInt(req.params.Did, 10);
  let pid = parseInt(req.params.Pid, 10);

  console.log(did, pid);

  try {
    const doctor = await Staff.self(connection, did);

    if (doctor.userType !== "Doctor") {
      return res.status(403).send("Access denied. You are not a doctor.");
    }

    const PatientID = await doctor.showPatientProfile(connection, pid);
    res.json(PatientID);
  } catch (err) {
    console.error(err);
    res.status(404).send(`You don't have a patient with ID: ${pid}`);
  }
});

// app.get("/mypath/go/:Did/:Pid", async (req, res) => {
//   let did = parseInt(req.params.Did, 10);
//   let pid = parseInt(req.params.Pid, 10);

//   console.log(did, pid);

//   try {
//     const doctor = await Staff.self(connection, did);

//     if (doctor.userType !== "Doctor") {
//       return res.status(403).send("Access denied. You are not a doctor.");
//     }

//     const PatientID = await doctor.showPatientProfile(connection, pid);
//     res.json(PatientID);
//   } catch (err) {
//     console.error(err);
//     res.status(404).send(`You don't have a patient with ID: ${pid}`);
//   }
// });

// 🧪 Edit patient details (POST)
app.post("/staff/:staffId/patient/:patientId/edit", async (req, res) => {
  const staffId = parseInt(req.params.staffId);
  const patientId = parseInt(req.params.patientId);
  const { Diagnosis, Treatment, Prescription, LabResults, DoctorID } = req.body;

  const staff = await Staff.self(connection, staffId);
  if (!staff) return res.status(404).send("Staff not found");

  try {
    await staff.editDetails(
      connection,
      patientId,
      Diagnosis,
      Treatment,
      Prescription,
      LabResults,
      DoctorID
    );

    res.status(200).send("Updated successfully");
  } catch (err) {
    res.status(403).send(err.message);
  }
});

// 🧪 Update appointment (PUT)
app.put("/staff/:staffId/patient/:patientId/appointment", async (req, res) => {
  const staffId = parseInt(req.params.staffId);
  const patientId = parseInt(req.params.patientId);
  const { DoctorID, AppointmentDate, note } = req.body;

  const staff = await Staff.self(connection, staffId);
  if (!staff) return res.status(404).send("Staff not found");

  try {
    await staff.updateAppointment(connection, patientId, DoctorID, AppointmentDate, note);
    res.send("Appointment updated.");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🧪 Display billing (GET)
app.get("/staff/patient/:patientId/bill", async (req, res) => {
  const staffId = parseInt(req.params.staffId);
  const patientId = parseInt(req.params.patientId);
  const staff = await Staff.self(connection, 3);
  if (!staff) return res.status(404).send("Staff not found");

  try {
    const bill = await staff.displayBill(connection, patientId);
    res.json(bill);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
