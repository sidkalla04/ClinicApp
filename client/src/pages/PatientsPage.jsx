import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPatientsApi, deletePatientApi } from '../api/axios';
import Header from '../components/Layout/Header';
import ConfirmDialog from '../components/ConfirmDialog';
import { FaSearch, FaUserPlus, FaEye, FaEdit, FaTrash, FaCopy, FaPhoneAlt, FaFolder } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletePatientId, setDeletePatientId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [search, searchDate]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatientsApi({ search, date: searchDate });
      setPatients(res.data.patients || []);
    } catch (err) {
      toast.error('Failed to load patients list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletePatientId) {
      try {
        await deletePatientApi(deletePatientId);
        toast.success('Patient record deleted successfully');
        setPatients(prev => prev.filter(p => p._id !== deletePatientId));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete patient record');
      } finally {
        setDeletePatientId(null);
      }
    }
  };

  const handleDuplicate = (id) => {
    navigate(`/patients/new?duplicateId=${id}`);
  };

  return (
    <>
      <Header title="Patients Registry" subtitle="Manage patient registration and consults" />

      <div className="page-body">
        {/* Actions header */}
        <div className="section-header">
          <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '650px', alignItems: 'center' }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by name, contact, case no, diagnosis..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>Date:</span>
              <input 
                type="date" 
                className="form-input" 
                style={{ width: '150px' }}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              {searchDate && (
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm" 
                  style={{ padding: '6px 8px' }} 
                  onClick={() => setSearchDate('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <Link to="/patients/new" className="btn btn-primary">
            <FaUserPlus />
            <span>Add New Patient</span>
          </Link>
        </div>

        {/* Patients List Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Searching patients...</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <FaFolder />
              <p>No patients found. Create a new patient profile or adjust search query.</p>
            </div>
          </div>
        ) : (
          <div className="patients-grid">
            {patients.map((patient) => (
              <div key={patient._id} className="patient-card" onClick={() => navigate(`/patients/${patient._id}`)}>
                <div className="patient-card-header">
                  <div>
                    <h3 className="patient-name">{patient.name}</h3>
                    <div className="patient-meta">
                      <span className="badge badge-teal">Case: {patient.caseNo || 'N/A'}</span>
                      <span className="patient-meta-item">{patient.age ? `${patient.age} yrs` : 'Age N/A'}</span>
                      <span className="patient-meta-item">{patient.gender || 'Gender N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Actions buttons */}
                  <div className="patient-actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/patients/${patient._id}`} className="btn btn-secondary btn-sm" title="View Patient File">
                      <FaEye />
                    </Link>
                    <Link to={`/patients/${patient._id}/edit`} className="btn btn-secondary btn-sm" title="Edit Profile">
                      <FaEdit style={{ color: 'var(--teal)' }} />
                    </Link>
                    <button className="btn btn-secondary btn-sm" title="Duplicate (Base on Existing)" onClick={() => handleDuplicate(patient._id)}>
                      <FaCopy style={{ color: 'var(--orange)' }} />
                    </button>
                    <button className="btn btn-secondary btn-sm" title="Delete Patient File" onClick={() => setDeletePatientId(patient._id)}>
                      <FaTrash style={{ color: 'var(--red)' }} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {patient.contactNo && (
                    <div className="patient-meta-item">
                      <FaPhoneAlt style={{ color: 'var(--gray-400)' }} />
                      <span>{patient.contactNo}</span>
                    </div>
                  )}
                  {patient.diagnosis && (
                    <div className="patient-meta-item" style={{ flex: 1, minWidth: '200px' }}>
                      <strong style={{ color: 'var(--gray-600)' }}>Diagnosis: </strong>
                      <span style={{ color: 'var(--gray-700)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {patient.diagnosis}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!deletePatientId}
        title="Delete Patient Record"
        message="Are you sure you want to permanently delete this patient record and ALL linked therapy session logs? This action is IRREVERSIBLE."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletePatientId(null)}
      />
    </>
  );
};

export default PatientsPage;
