import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientApi, updatePatientApi } from '../api/axios';
import Header from '../components/Layout/Header';
import ConsultationForm from '../components/ConsultationForm';
import toast from 'react-hot-toast';

const EditPatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientApi(id)
      .then((res) => setPatient(res.data))
      .catch(() => {
        toast.error('Failed to load patient record');
        navigate('/patients');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await updatePatientApi(id, formData);
      toast.success('Patient record updated successfully');
      navigate(`/patients/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update patient record');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Retrieving patient file...</span>
      </div>
    );
  }

  return (
    <>
      <Header title={`Edit Patient: ${patient?.name}`} subtitle="Modify consultation registration fields" />
      <div className="page-body">
        <ConsultationForm 
          initialData={patient}
          onSubmit={handleSubmit}
          isEdit={true}
          onCancel={() => navigate(`/patients/${id}`)}
        />
      </div>
    </>
  );
};

export default EditPatientPage;
