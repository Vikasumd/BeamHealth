import { useEffect, useState } from "react";
import api from "./api/client";
import EmployeeLookupForm from "./components/EmployeeLookupForm";
import InsuranceSearch from "./components/InsuranceSearch";
import EligibilityPanel from "./components/EligibilityPanel";
import RoutingPanel from "./components/RoutingPanel";
import SlotsList from "./components/SlotsList";
import FollowUpPanel from "./components/FollowUpPanel";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const [workflowResult, setWorkflowResult] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [followUpResult, setFollowUpResult] = useState(null);

  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  const handleRunWorkflow = async () => {
    setError("");
    setFollowUpResult(null);
    setWorkflowResult(null);
    setSelectedSlotId(null);

    if (!selectedPatient || !selectedInsurance) {
      setError("Please select an employee and insurance plan.");
      return;
    }

    try {
      setLoadingWorkflow(true);
      const res = await api.post("/workflow/run", {
        patientId: selectedPatient.id,
        insuranceId: selectedInsurance.id
      });
      setWorkflowResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to run workflow.");
    } finally {
      setLoadingWorkflow(false);
    }
  };

  const handleBook = async () => {
    setError("");
    if (!selectedSlotId) {
      setError("Please select an appointment slot to book.");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post("/workflow/book", {
        appointmentId: Number(selectedSlotId),
        patientId: selectedPatient.id,
        insuranceId: selectedInsurance.id
      });
      setFollowUpResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to book appointment.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePatientSelected = (patient) => {
    setSelectedPatient(patient);
    if (!patient) {
      // Clear everything when patient is cleared
      setSelectedInsurance(null);
      setWorkflowResult(null);
      setFollowUpResult(null);
      setSelectedSlotId(null);
      setError("");
    }
  };

  const handlePatientCreated = (newPatient) => {
    setPatients([...patients, newPatient]);
    setSelectedPatient(newPatient);
    setWorkflowResult(null);
    setFollowUpResult(null);
  };

  const handleInsuranceSelect = (insurance) => {
    setSelectedInsurance(insurance);
    if (!insurance || (selectedInsurance && insurance?.id !== selectedInsurance?.id)) {
      setWorkflowResult(null);
      setFollowUpResult(null);
      setSelectedSlotId(null);
      setError("");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Beam Front-Desk <span>Copilot</span></h1>
        <p className="subtitle">
          Employee Lookup → Eligibility → Smart Routing → Scheduling → Follow-up
        </p>
      </header>

      <main className="app-main">
        {/* Step 1: Employee Lookup Form */}
        <section className="card">
          <EmployeeLookupForm
            patients={patients}
            onPatientSelected={handlePatientSelected}
            onPatientCreated={handlePatientCreated}
          />
        </section>

        {/* Step 2: Insurance Selection - Show only when patient is selected */}
        {selectedPatient && (
          <section className="card">
            <h2>2. Select Insurance Plan</h2>
            <div className="insurance-section">
              <InsuranceSearch
                selectedInsurance={selectedInsurance}
                onSelect={handleInsuranceSelect}
              />
            </div>

            <button 
              className="primary-btn" 
              onClick={handleRunWorkflow} 
              disabled={loadingWorkflow || !selectedPatient || !selectedInsurance}
            >
              {loadingWorkflow ? "Running workflow..." : "Run Unified Workflow"}
            </button>

            {error && <div className="error-box">{error}</div>}
          </section>
        )}

        {workflowResult && (
          <section className="grid">
            <div className="card">
              <h2>3. Eligibility</h2>
              <EligibilityPanel eligibility={workflowResult.eligibility} />
              <h3>4. Smart Routing (for denials)</h3>
              <RoutingPanel routing={workflowResult.routing} />
            </div>

            <div className="card">
              <h2>5. Available Slots</h2>
              <SlotsList
                slots={workflowResult.availableSlots || []}
                selectedSlotId={selectedSlotId}
                onSelectSlot={setSelectedSlotId}
              />

              <button
                className="primary-btn"
                onClick={handleBook}
                disabled={bookingLoading || !selectedSlotId}
              >
                {bookingLoading ? "Booking..." : "Book & Generate Follow-Up"}
              </button>
            </div>
          </section>
        )}

        {followUpResult && (
          <section className="card">
            <h2>6. Follow-up Package</h2>
            <FollowUpPanel followUp={followUpResult.followUp} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

