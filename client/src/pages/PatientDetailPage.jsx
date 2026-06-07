import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getPatientApi, 
  getTherapySessionsApi, 
  addTherapySessionApi, 
  updateTherapySessionApi, 
  deleteTherapySessionApi 
} from '../api/axios';
import Header from '../components/Layout/Header';
import TherapySessionTable from '../components/TherapySessionTable';
import { FaEdit, FaArrowLeft, FaHeartbeat, FaCalendarAlt, FaCopy, FaPrint } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('therapy'); // 'therapy' or 'consultation'

  useEffect(() => {
    fetchPatientAndSessions();
  }, [id]);

  const fetchPatientAndSessions = async () => {
    try {
      setLoading(true);
      const [patientRes, sessionsRes] = await Promise.all([
        getPatientApi(id),
        getTherapySessionsApi(id)
      ]);
      setPatient(patientRes.data);
      setSessions(sessionsRes.data || []);
    } catch (err) {
      toast.error('Failed to load patient records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (newSession) => {
    try {
      const res = await addTherapySessionApi(id, newSession);
      toast.success('Therapy session added');
      setSessions(prev => [...prev, res.data]);
    } catch (err) {
      toast.error('Failed to add therapy session');
    }
  };

  const handleUpdateSession = async (sessionId, updatedData) => {
    try {
      const res = await updateTherapySessionApi(sessionId, updatedData);
      toast.success('Session details updated');
      setSessions(prev => prev.map(s => s._id === sessionId ? res.data : s));
    } catch (err) {
      toast.error('Failed to update session details');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteTherapySessionApi(sessionId);
      toast.success('Session log deleted');
      setSessions(prev => prev.filter(s => s._id !== sessionId));
    } catch (err) {
      toast.error('Failed to delete session log');
    }
  };

  const handleDuplicate = () => {
    navigate(`/patients/new?duplicateId=${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading patient profile...</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-body">
        <div className="alert alert-error">Patient file not found.</div>
      </div>
    );
  }

  return (
    <>
      <Header title={patient.name} subtitle={`Case No: ${patient.caseNo || 'N/A'}`} />
      
      <div className="page-body">
        {/* Back and Page Actions bar */}
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate('/patients')}>
            <FaArrowLeft />
            <span>All Patients</span>
          </button>
          
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={handleDuplicate} title="Duplicate Profile">
              <FaCopy />
              <span>Duplicate</span>
            </button>
            <button className="btn btn-secondary" onClick={handlePrint} title="Print Profile / Log">
              <FaPrint />
              <span>Print Page</span>
            </button>
            <Link to={`/patients/${patient._id}/edit`} className="btn btn-primary">
              <FaEdit />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'therapy' ? 'active' : ''}`}
            onClick={() => setActiveTab('therapy')}
          >
            Therapy History ({sessions.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultation')}
          >
            First Consultation Details
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'therapy' && (
          <TherapySessionTable 
            sessions={sessions}
            onAdd={handleAddSession}
            onUpdate={handleUpdateSession}
            onDelete={handleDeleteSession}
          />
        )}

        {activeTab === 'consultation' && (
          <div className="card">
            <div className="card-header">
              <h3>First Consultation Record</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-teal">BP: {patient.bp || 'N/A'}</span>
                <span className={`badge ${patient.diabetes ? 'badge-red' : 'badge-green'}`}>
                  {patient.diabetes ? 'Diabetic' : 'Non-Diabetic'}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              {/* Profile details */}
              <div className="form-section">
                <div className="form-section-title">Administrative & Personal Info</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Consulting Doctor</label>
                    <span>{patient.consultingDoctorName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date of Examination</label>
                    <span>{patient.dateOfExamination ? format(new Date(patient.dateOfExamination), 'dd MMM yyyy') : 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender</label>
                    <span>{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Age / Years</label>
                    <span>{patient.age || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>D.O.B</label>
                    <span>{patient.dob ? format(new Date(patient.dob), 'dd MMM yyyy') : 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact No.</label>
                    <span>{patient.contactNo || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Occupation</label>
                    <span>{patient.occupationWork || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Marital Status</label>
                    <span>{patient.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Referred By</label>
                    <span>{patient.referredBy || 'N/A'}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Address</label>
                    <span>{patient.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis and Symptoms */}
              <div className="form-section">
                <div className="form-section-title">Clinical History & Evaluation</div>
                <div className="detail-grid">
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Chief Complaint</label>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{patient.chiefComplaint || 'N/A'}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Diagnosis</label>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{patient.diagnosis || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Old Radiographic Report</label>
                    <span>{patient.oldRadiographicReport || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lab / Blood Test Report</label>
                    <span>{patient.labBloodTestReport === 'Y' ? 'Yes (Y)' : patient.labBloodTestReport === 'N' ? 'No (N)' : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Previous treatments */}
              <div className="form-section">
                <div className="form-section-title">Previous Treatments</div>
                {patient.previousTreatment?.length === 0 ? (
                  <span className="text-muted">None logged.</span>
                ) : (
                  <div className="tag-list">
                    {patient.previousTreatment.map(t => (
                      <span key={t} className="tag">{t.toUpperCase()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pain Areas list */}
              <div className="form-section">
                <div className="form-section-title">Pain Area Localization</div>
                {patient.painAreas?.length === 0 ? (
                  <span className="text-muted">No specific pain areas selected.</span>
                ) : (
                  <div className="tag-list">
                    {patient.painAreas.map(pa => (
                      <span key={pa.area} className="tag" style={{ background: 'var(--orange-light)', color: '#92400e' }}>
                        {pa.area}: {pa.sides.join(', ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pain details */}
              <div className="form-section">
                <div className="form-section-title">Pain Description & Vitals</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Duration</label>
                    <span>{patient.duration || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nature of Pain</label>
                    <span>{patient.natureOfPain || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Sleep Status</label>
                    <span>{patient.sleep || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Genetic Condition</label>
                    <span>{patient.anyGeneticCondition || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Daily Travel Mode</label>
                    <span>{patient.traveling?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Daily Travel Distance</label>
                    <span>{patient.dailyKm || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Blood Pressure (BP)</label>
                    <span>{patient.bp || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Diabetes Status</label>
                    <span>{patient.diabetes ? 'Yes (Diabetic)' : 'No (Non-Diabetic)'}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Pain Types</label>
                    <span>{patient.typesOfPain?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Stiffness period</label>
                    <span>{patient.stiffness?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Habits</label>
                    <span>{patient.habit?.join(', ') || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label className="form-label">Pain Intensity Score ({patient.painScale}/10)</label>
                  <div className="pain-scale-bar" style={{ marginTop: '6px' }}>
                    <div className="pain-scale-fill" style={{ width: `${(patient.painScale || 0) * 10}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Therapist notes */}
              {patient.notes && (
                <div className="form-section">
                  <div className="form-section-title">Therapist Observational Notes</div>
                  <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)', whiteSpace: 'pre-wrap' }}>
                    {patient.notes}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientDetailPage;
