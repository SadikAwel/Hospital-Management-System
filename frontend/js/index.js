// <!-- this to retrive patiant information by using id number -->

// for login below this

async function submitInsertAppointment() {
  const doctorId = document.getElementById("insert-doctor-id").value;
  const patientId = document.getElementById("insert-patient-id").value;
  const date = document.getElementById("insert-date").value;
  const notes = document.getElementById("insert-notes").value;

  const appointmentData = {
    doctorId,
    patientId,
    date,
    notes,
  };

  try {
    const response = await fetch("http://localhost:4000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    const result = await response.json();
    alert("Appointment Inserted: " + result.message);
  } catch (error) {
    console.error("Error inserting appointment:", error);
    alert("Failed to insert appointment");
  }
}

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Update Appointment
async function updateAppointment() {
  const id = document.querySelector('#update-appointment input[placeholder="ID"]').value;
  const docId = document.querySelector('#update-appointment input[placeholder="Doctoral ID"]').value;
  const date = document.querySelector('#update-appointment input[type="date"]').value;
  const notes = document.querySelector('#update-appointment input[placeholder="Notes"]').value;

  const response = await postData("/api/appointments/update", {
    id,
    docId,
    date,
    notes,
  });

  alert(response.message || "Appointment Updated");
}

// Insert Appointment
async function insertAppointment() {
  const docId = document.querySelector('#insert-appointment input[placeholder="Doctor ID"]').value;
  const patientId = document.querySelector('#insert-appointment input[placeholder="Patient ID"]').value;
  const date = document.querySelector('#insert-appointment input[type="date"]').value;
  const notes = document.querySelector('#insert-appointment input[placeholder="Notes"]').value;

  const response = await postData("/api/appointments/insert", {
    docId,
    patientId,
    date,
    notes,
  });

  alert(response.message || "Appointment Inserted");
}

// Display Bill
async function displayBill() {
  const id = document.querySelector('#bill-section input[placeholder="Enter ID"]').value;

  const response = await postData("/api/bill/display", { id });

  const billDisplay = document.getElementById("bill-display");
  billDisplay.innerText = response.billDetails || "No bill found";
  billDisplay.style.display = "block";
}

// Edit Inpatient Info
async function editInpatient() {
  const form = document.getElementById("edit-inpatient");
  const data = {
    id: form.querySelector('input[placeholder="ID"]').value,
    diagnosis: form.querySelector('input[placeholder="Diagnosis"]').value,
    treatment: form.querySelector('input[placeholder="Treatment"]').value,
    prescription: form.querySelector('input[placeholder="Prescription"]').value,
    labResult: form.querySelector('input[placeholder="Lab Result"]').value,
    doctorId: form.querySelector('input[placeholder="Doctoral ID"]').value,
  };

  const response = await postData("/api/inpatient/edit", data);

  alert(response.message || "Inpatient Updated");
}
async function findPatient() {
  const did = document.getElementById("doctorId").value;
  const id = document.getElementById("patientId").value;
  document.getElementById("myForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!staffId || !patientId) {
      alert("Please enter both Staff ID and Patient ID.");
      return;
    }

    try {
      const response = await fetch(`/staff/${staffId}/patient/${patientId}`);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      const data = await response.json();

      // Display patient information
      document.getElementById("patient-firstname").innerText = `First Name: ${data.firstname}`;
      document.getElementById("patient-lastname").innerText = `Last Name: ${data.lastname}`;
      document.getElementById("patient-age").innerText = `Age: ${data.age}`;
      document.getElementById("patient-phone").innerText = `Phone Number: ${data.phoneNumber}`;
      document.getElementById("patient-info").style.display = "block";
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}
async function afindPatient(event) {
  event.preventDefault(); // prevent page reload

  const doctorId = document.getElementById("doctorId").value;
  const patientId = document.getElementById("patientId").value;

  if (!doctorId || !patientId) {
    alert("Please enter both Doctor ID and Patient ID");
    return;
  }

  try {
    const response = await fetch(`http://localhost:4000/mypath/go/${doctorId}/${patientId}`);

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const patient = await response.json();

    // ✅ Match these to your API keys (returned from showPatientProfile)
    document.getElementById("patient-firstname").textContent = patient.firstname || "N/A";
    document.getElementById("patient-lastname").textContent = patient.lastname || "N/A";
    document.getElementById("patient-age").textContent = patient.age || "N/A";
    document.getElementById("patient-phone").textContent = patient.phoneNumber || "N/A";

    document.getElementById("patient-info").style.display = "block";
  } catch (err) {
    console.error("Error fetching patient:", err);
    alert("Could not fetch patient: " + err.message);
  }
}
