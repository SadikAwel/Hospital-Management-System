// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        if (mobileMenu.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // Set current year in footer
  const currentYearElements = document.querySelectorAll("#current-year");
  currentYearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons and panes
        document.querySelectorAll(".tab-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        document.querySelectorAll(".tab-pane").forEach((pane) => {
          pane.classList.remove("active");
        });

        // Add active class to clicked button and corresponding pane
        this.classList.add("active");
        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  // Stats counter animation
  const statCounters = document.querySelectorAll(".stat-number");
  if (statCounters.length > 0) {
    const options = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-count"));
          let count = 0;
          const duration = 2000; // 2 seconds
          const increment = Math.ceil(target / (duration / 16)); // 60fps

          const updateCount = () => {
            count += increment;
            if (count >= target) {
              counter.textContent = target + "+";
              return;
            }
            counter.textContent = count + "+";
            requestAnimationFrame(updateCount);
          };

          updateCount();
          observer.unobserve(counter);
        }
      });
    }, options);

    statCounters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  // Patient Lookup Form
  const patientLookupForm = document.getElementById("patient-lookup-form");
  if (patientLookupForm) {
    patientLookupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const doctorId = document.getElementById("doctorId").value;
      const patientId = document.getElementById("patientId").value;
      const errorElement = document.getElementById("lookup-error");
      const resultElement = document.getElementById("patient-result");
      const lookupBtn = document.getElementById("lookup-btn");

      if (!doctorId || !patientId) {
        errorElement.textContent = "Please enter both Doctor ID and Patient ID";
        return;
      }

      errorElement.textContent = "";
      lookupBtn.textContent = "Loading...";
      lookupBtn.disabled = true;

      try {
        // In a real application, you would use the actual API endpoint
        // For demo purposes, we'll use a mock response after a delay
        // const response = await fetch(`http://127.0.0.1:4000/mypath/go/${doctorId}/${patientId}`);
        // const data = await response.json();

        // Mock response for demonstration
        setTimeout(() => {
          const mockData = {
            patientId: patientId,
            name: "John Doe",
            age: 45,
            gender: "Male",
            bloodType: "O+",
            diagnosis: "Hypertension",
            admissionDate: "2023-05-15",
            doctor: `Dr. Smith (ID: ${doctorId})`,
            medications: ["Lisinopril", "Aspirin"],
            vitalSigns: {
              bloodPressure: "130/85",
              heartRate: 72,
              temperature: 98.6,
            },
          };

          // Display the result
          resultElement.innerHTML = `
                        <div class="card">
                            <h3>Patient Information</h3>
                            <div class="patient-info-grid">
                                <div class="patient-info-label">Patient ID:</div>
                                <div>${mockData.patientId}</div>
                                
                                <div class="patient-info-label">Name:</div>
                                <div>${mockData.name}</div>
                                
                                <div class="patient-info-label">Age:</div>
                                <div>${mockData.age}</div>
                                
                                <div class="patient-info-label">Gender:</div>
                                <div>${mockData.gender}</div>
                                
                                <div class="patient-info-label">Blood Type:</div>
                                <div>${mockData.bloodType}</div>
                                
                                <div class="patient-info-label">Diagnosis:</div>
                                <div>${mockData.diagnosis}</div>
                                
                                <div class="patient-info-label">Admission Date:</div>
                                <div>${mockData.admissionDate}</div>
                                
                                <div class="patient-info-label">Doctor:</div>
                                <div>${mockData.doctor}</div>
                                
                                <div class="patient-info-label">Medications:</div>
                                <div>${mockData.medications.join(", ")}</div>
                                
                                <div class="patient-info-label">Vital Signs:</div>
                                <div>
                                    <div class="vital-signs">
                                        <div>Blood Pressure: ${mockData.vitalSigns.bloodPressure}</div>
                                        <div>Heart Rate: ${mockData.vitalSigns.heartRate} bpm</div>
                                        <div>Temperature: ${mockData.vitalSigns.temperature}°F</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

          resultElement.classList.add("active");
          lookupBtn.textContent = "Get Patient Data";
          lookupBtn.disabled = false;
        }, 1000);
      } catch (err) {
        errorElement.textContent = "There is a problem. Please try again later.";
        lookupBtn.textContent = "Get Patient Data";
        lookupBtn.disabled = false;
      }
    });
  }

  // Doctor Patient Lookup Form
  const doctorPatientLookupForm = document.getElementById("doctor-patient-lookup-form");
  if (doctorPatientLookupForm) {
    doctorPatientLookupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const doctorId = document.getElementById("doctor-lookup-id").value;
      const patientId = document.getElementById("doctor-lookup-patient-id").value;
      const errorElement = document.getElementById("doctor-lookup-error");
      const resultElement = document.getElementById("doctor-patient-result");
      const lookupBtn = document.getElementById("doctor-lookup-btn");

      if (!doctorId || !patientId) {
        errorElement.textContent = "Please enter both Doctor ID and Patient ID";
        return;
      }

      errorElement.textContent = "";
      lookupBtn.textContent = "Loading...";
      lookupBtn.disabled = true;

      try {
        // Mock response for demonstration
        setTimeout(() => {
          const mockData = {
            patientId: patientId,
            name: "John Doe",
            age: 45,
            gender: "Male",
            bloodType: "O+",
            diagnosis: "Hypertension",
            admissionDate: "2023-05-15",
            doctor: `Dr. Smith (ID: ${doctorId})`,
            medications: ["Lisinopril", "Aspirin"],
            vitalSigns: {
              bloodPressure: "130/85",
              heartRate: 72,
              temperature: 98.6,
            },
          };

          // Display the result
          resultElement.innerHTML = `
                        <div class="card">
                            <h3>Patient Information</h3>
                            <div class="patient-info-grid">
                                <div class="patient-info-label">Patient ID:</div>
                                <div>${mockData.patientId}</div>
                                
                                <div class="patient-info-label">Name:</div>
                                <div>${mockData.name}</div>
                                
                                <div class="patient-info-label">Age:</div>
                                <div>${mockData.age}</div>
                                
                                <div class="patient-info-label">Gender:</div>
                                <div>${mockData.gender}</div>
                                
                                <div class="patient-info-label">Blood Type:</div>
                                <div>${mockData.bloodType}</div>
                                
                                <div class="patient-info-label">Diagnosis:</div>
                                <div>${mockData.diagnosis}</div>
                                
                                <div class="patient-info-label">Admission Date:</div>
                                <div>${mockData.admissionDate}</div>
                                
                                <div class="patient-info-label">Doctor:</div>
                                <div>${mockData.doctor}</div>
                                
                                <div class="patient-info-label">Medications:</div>
                                <div>${mockData.medications.join(", ")}</div>
                                
                                <div class="patient-info-label">Vital Signs:</div>
                                <div>
                                    <div class="vital-signs">
                                        <div>Blood Pressure: ${mockData.vitalSigns.bloodPressure}</div>
                                        <div>Heart Rate: ${mockData.vitalSigns.heartRate} bpm</div>
                                        <div>Temperature: ${mockData.vitalSigns.temperature}°F</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

          resultElement.classList.add("active");
          lookupBtn.textContent = "Get Patient Data";
          lookupBtn.disabled = false;
        }, 1000);
      } catch (err) {
        errorElement.textContent = "There is a problem. Please try again later.";
        lookupBtn.textContent = "Get Patient Data";
        lookupBtn.disabled = false;
      }
    });
  }
});
