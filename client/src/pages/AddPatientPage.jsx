import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPatientApi, getPatientApi } from '../api/axios';
import Header from '../components/Layout/Header';
import ConsultationForm from '../components/ConsultationForm';
import toast from 'react-hot-toast';

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get('duplicateId');
  
  const [duplicateData, setDuplicateData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (duplicateId) {
      setLoading(true);
      getPatientApi(duplicateId)
        .then((res) => {
          // Remove ID and creation/update metadata for duplicate operation
          const { _id, createdAt, updatedAt, createdBy, caseNo, ...cleanData } = res.data;
          // Append "Copy" suffix to denote duplication
          cleanData.name = `${cleanData.name} (Copy)`;
          // Clear examination date to prompt setting the current date
          cleanData.dateOfExamination = new Date().toISOString().split('T')[0];
          setDuplicateData(cleanData);
          toast.success('Patient details duplicated! Review and save.');
        })
        .catch(() => toast.error('Failed to load patient template for duplication'))
        .finally(() => setLoading(false));
    }
  }, [duplicateId]);

  const handleSubmit = async (formData) => {
    try {
      const res = await createPatientApi(formData);
      toast.success('Patient profile created successfully');
      navigate(`/patients/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create patient profile');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Preparing patient template...</span>
      </div>
    );
  }

  return (
    <>
      <Header 
        title={duplicateId ? "Duplicate Patient Record" : "New Consultation Registration"} 
        subtitle={duplicateId ? "Modify fields below to register a duplicate patient profile" : "Create a completely new patient file"} 
      />
      <div className="page-body animate-slide-up">
        <ConsultationForm 
          initialData={duplicateData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/patients')}
        />
      </div>
    </>
  );
};

export default AddPatientPage;
