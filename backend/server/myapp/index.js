import express from "express";
import Staff from "../../javascript_class/Staff.js";
import connection from "../../javascript_class/connection.js";
import User from "../../javascript_class/User.js";
import Patient from "../../javascript_class/Patient.js";
import cors from "cors";

const app = express();
app.use(cors());
const router = express.Router();
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parse form data

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Frontend URL
  })
);

router.post("/staff/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const result = await Staff.login(connection, emailOrUsername, password);

    if (result.success) {
      res.status(200).json({ staff: result.staff });
    } else {
      res.status(401).json({ message: result.message });
    }
  } catch (error) {
    console.error("Login failed:", error); // ✅ this shows what's wrong in the console
    res.status(500).json({ message: "Server error aaaaa", error });
  }
});

// Don't forget to mount the router!
app.use("/", router); // Or app.use("/api", router);

// router.post("/staff/login", async (req, res) => {
//   const { emailOrUsername, password } = req.body;

//   try {
//     const result = await Staff.login(pool, emailOrUsername, password);

//     if (result.success) {
//       // Successful login - return JWT token + staff data (without password)
//       res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token: result.token, // JWT token from Staff.login()
//         staff: result.staff, // Staff data (without PasswordHash)
//       });
//     } else {
//       // Failed login (invalid credentials)
//       res.status(401).json({
//         success: false,
//         message: result.message || "Authentication failed",
//       });
//     }
//   } catch (error) {
//     // Server error (e.g., DB failure)
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during login",
//       error: error.message, // Only send error message (not full error object)
//     });
//   }
// });

// router.post("/staff/login", async (req, res) => {
//   headers: {
//     "Authorization": `Bearer ${your_jwt_token}`  // ✅ Attach token
//   }
//   const { emailOrUsername, password } = req.body;
//   res.send("first time");

//   try {
//     res.status(200).json({ success: true, message: "Login successful" });
//     const result = await Staff.login(pool, emailOrUsername, password);
//     if (result.success) {
//       res.status(200).json(result);
//     } else {
//       res.status(401).json(result);
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server aaa", error });
//     res.status(500).json({ success: false, message: "Server aaa", error: error.message });
//   }
// });

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default router;
