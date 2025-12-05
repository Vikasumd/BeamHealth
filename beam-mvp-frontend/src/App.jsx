import { useEffect, useState } from "react";
import api from "./api/client";
import PatientSearch from "./components/PatientSearch";
import InsuranceSearch from "./components/InsuranceSearch";
import NewPatientForm from "./components/NewPatientForm";
import IntakePanel from "./components/IntakePanel";
import EligibilityPanel from "./components/EligibilityPanel";
import RoutingPanel from "./components/RoutingPanel";
import SlotsList from "./components/SlotsList";
import FollowUpPanel from "./components/FollowUpPanel";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

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
      setError("Failed to load patients.");
    }
  };

  const handleRunWorkflow = async () => {
    setError("");
    setFollowUpResult(null);
    setWorkflowResult(null);
    setSelectedSlotId(null);

    if (!selectedPatient || !selectedInsurance) {
      setError("Please select a patient and insurance plan.");
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

  const handleNewPatientCreated = (newPatient) => {
    setPatients([...patients, newPatient]);
    setSelectedPatient(newPatient);
    setShowNewPatientForm(false);
    setWorkflowResult(null);
    setFollowUpResult(null);
  };

  // Reset all fields when patient is changed or cleared
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    // If patient is cleared, reset everything
    if (!patient) {
      setWorkflowResult(null);
      setFollowUpResult(null);
      setSelectedSlotId(null);
      setError("");
    }
  };

  // Reset workflow when insurance is changed
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
          Unified Intake → Eligibility → Smart Routing → Scheduling → Follow-up
        </p>
      </header>

      <main className="app-main">
        {showNewPatientForm ? (
          <section className="card">
            <NewPatientForm
              onPatientCreated={handleNewPatientCreated}
              onCancel={() => setShowNewPatientForm(false)}
            />
          </section>
        ) : (
          <section className="card">
            <h2>1. Select Patient & Insurance</h2>
            
            <div className="search-row">
              <PatientSearch
                patients={patients}
                selectedPatient={selectedPatient}
                onSelect={handlePatientSelect}
                onCreateNew={() => setShowNewPatientForm(true)}
              />
              
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
              <h2>2. Auto-filled Intake</h2>
              <IntakePanel intake={workflowResult.intake} />
            </div>

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
