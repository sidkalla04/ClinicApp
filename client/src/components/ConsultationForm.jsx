import { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaCopy, FaUndo } from 'react-icons/fa';

const PREVIOUS_TREATMENTS = [
  'Allopathic', 'Ayurvedic', 'Homeopathic', 'Physiotherapy', 
  'Medication', 'Surgery', 'Injection', 'Others', 'None'
];

const TYPES_OF_PAIN = [
  'Ache/Dull', 'Numb/Tingling', 'Burning/Throbbing', 
  'Sharp/Stabbing', 'Pins/Needles', 'Others'
];

const STIFFNESS_OPTIONS = ['Morning', 'Evening', 'Night', 'Whole Day'];

const TRAVELING_OPTIONS = ['2 Wheeler', '4 Wheeler', 'Local Transport', 'Walking'];

const HABITS = ['Smoking', 'Alcohol', 'Tobacco', 'Others'];

const PAIN_AREAS_LIST = [
  // Upper body / Spine / Arm
  { key: 'Headhead', label: 'Headache', sides: true },
  { key: 'Giddiness', label: 'Giddiness', sides: true },
  { key: 'Vertigo', label: 'Vertigo', sides: false },
  { key: 'Face', label: 'Face', sides: true },
  { key: 'Neck', label: 'Neck', sides: true },
  { key: 'Scapula', label: 'Scapula', sides: true },
  { key: 'Shoulder', label: 'Shoulder', sides: true },
  { key: 'Arm', label: 'Arm', sides: true },
  { key: 'Elbow', label: 'Elbow', sides: true },
  { key: 'Bicep', label: 'Bicep', sides: true },
  { key: 'Condile', label: 'Condile', sides: true },
  { key: 'Forearm', label: 'Forearm', sides: true },
  { key: 'Wrist', label: 'Wrist', sides: true },
  { key: 'Thumb', label: 'Thumb', sides: true },
  { key: 'Palm', label: 'Palm (Dorsi/Palmer)', sides: true, customSides: ['Dorsi', 'Palmer'] },
  { key: 'Fingers', label: 'Fingers (1, 2, 3, 4)', sides: true, customSides: ['1', '2', '3', '4'] },

  // Torso & Lower Body
  { key: 'Chest', label: 'Chest', sides: false },
  { key: 'Abdomen', label: 'Abdomen', sides: false },
  { key: 'Midback', label: 'Mid back', sides: false },
  { key: 'BackLower', label: 'Back Lower', sides: false },
  { key: 'Coccyx', label: 'Coccyx', sides: false },
  { key: 'Sacroiliac', label: 'Sacroiliac', sides: true },
  { key: 'Hip', label: 'Hip', sides: true },
  { key: 'Groin', label: 'Groin', sides: true },
  { key: 'Thigh', label: 'Thigh', sides: true },
  { key: 'ITband', label: 'I-T band', sides: true },
  { key: 'Knee', label: 'Knee', sides: true },
  { key: 'Shin', label: 'Shin', sides: true },
  { key: 'Calf', label: 'Calf', sides: true },
  { key: 'Ankle', label: 'Ankle', sides: true },
  { key: 'Heel', label: 'Heel', sides: true },
  { key: 'GreatToe', label: 'Great Toe', sides: true },
  { key: 'Feet', label: 'Feet (Dorsi/Plantar)', sides: true, customSides: ['Dorsi', 'Plantar'] },
  { key: 'Toes', label: 'Toes (1, 2, 3, 4)', sides: true, customSides: ['1', '2', '3', '4'] }
];

const INITIAL_FORM_STATE = {
  caseNo: '',
  consultingDoctorName: '',
  dateOfExamination: new Date().toISOString().split('T')[0],
  name: '',
  dob: '',
  gender: '',
  address: '',
  age: '',
  occupationWork: '',
  maritalStatus: '',
  contactNo: '',
  referredBy: '',
  chiefComplaint: '',
  diagnosis: '',
  oldRadiographicReport: '',
  labBloodTestReport: '',
  previousTreatment: [],
  painAreas: [],
  duration: '',
  natureOfPain: '',
  typesOfPain: [],
  stiffness: [],
  sleep: '',
  traveling: [],
  dailyKm: '',
  habit: [],
  bp: '',
  diabetes: false,
  anyGeneticCondition: '',
  painScale: 0,
  notes: ''
};

const ConsultationForm = ({ initialData, onSubmit, isEdit = false, onCancel }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Map incoming details to form state
      const mappedData = { ...INITIAL_FORM_STATE, ...initialData };
      if (initialData.dateOfExamination) {
        mappedData.dateOfExamination = new Date(initialData.dateOfExamination).toISOString().split('T')[0];
      }
      if (initialData.dob) {
        mappedData.dob = new Date(initialData.dob).toISOString().split('T')[0];
      }
      setFormData(mappedData);
    }
  }, [initialData]);

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const today = new Date();
    const birthDate = new Date(dobString);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge.toString() : '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'dob' && value) {
        updated.age = calculateAge(value);
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handlePainAreaSideToggle = (areaKey, side) => {
    setFormData((prev) => {
      const existingAreas = [...prev.painAreas];
      const areaIndex = existingAreas.findIndex((pa) => pa.area === areaKey);

      if (areaIndex > -1) {
        const areaObj = { ...existingAreas[areaIndex] };
        if (areaObj.sides.includes(side)) {
          areaObj.sides = areaObj.sides.filter((s) => s !== side);
        } else {
          areaObj.sides = [...areaObj.sides, side];
        }

        if (areaObj.sides.length === 0) {
          // remove area entirely
          existingAreas.splice(areaIndex, 1);
        } else {
          existingAreas[areaIndex] = areaObj;
        }
      } else {
        existingAreas.push({ area: areaKey, sides: [side] });
      }

      return { ...prev, painAreas: existingAreas };
    });
  };

  const isPainAreaSideActive = (areaKey, side) => {
    const areaObj = formData.painAreas.find((pa) => pa.area === areaKey);
    return areaObj ? areaObj.sides.includes(side) : false;
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Patient name is required';
    
    const contactTrimmed = formData.contactNo.trim();
    if (!contactTrimmed) {
      tempErrors.contactNo = 'Contact number is required';
    } else if (!/^\+?([0-9]{2})?[-. ]?([6-9][0-9]{9})$/.test(contactTrimmed)) {
      tempErrors.contactNo = 'Please enter a valid 10-digit contact number';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-body">
        {/* Administrative Header */}
        <div className="form-section">
          <div className="form-section-title">Administrative Info</div>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Case No.</label>
              <input 
                type="text" 
                name="caseNo" 
                className="form-input" 
                value={formData.caseNo} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Consulting Doctor Name</label>
              <input 
                type="text" 
                name="consultingDoctorName" 
                className="form-input" 
                value={formData.consultingDoctorName} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Examination</label>
              <input 
                type="date" 
                name="dateOfExamination" 
                className="form-input" 
                value={formData.dateOfExamination} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="form-section">
          <div className="form-section-title">Patient Profile</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name} 
                onChange={handleChange}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                className="form-input" 
                value={formData.dob} 
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Age / Years</label>
              <input 
                type="text" 
                name="age" 
                className="form-input" 
                value={formData.age} 
                onChange={handleChange}
                placeholder="e.g. 45"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Contact No.</label>
              <input 
                type="text" 
                name="contactNo" 
                className={`form-input ${errors.contactNo ? 'error' : ''}`}
                value={formData.contactNo} 
                onChange={handleChange}
              />
              {errors.contactNo && <span className="form-error">{errors.contactNo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Occupation / Work</label>
              <input 
                type="text" 
                name="occupationWork" 
                className="form-input" 
                value={formData.occupationWork} 
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select name="maritalStatus" className="form-select" value={formData.maritalStatus} onChange={handleChange}>
                <option value="">Select Marital Status</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Referred By</label>
              <input 
                type="text" 
                name="referredBy" 
                className="form-input" 
                value={formData.referredBy} 
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Address</label>
              <input 
                type="text" 
                name="address" 
                className="form-input" 
                value={formData.address} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Diagnosis & Clinical Reports */}
        <div className="form-section">
          <div className="form-section-title">Clinical History</div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Chief Complaint</label>
              <textarea 
                name="chiefComplaint" 
                className="form-textarea" 
                value={formData.chiefComplaint} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Diagnosis</label>
              <textarea 
                name="diagnosis" 
                className="form-textarea" 
                value={formData.diagnosis} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid-2 mt-4">
            <div className="form-group">
              <label className="form-label">Old Radiographic Report (X-Ray/MRI/CT)</label>
              <select name="oldRadiographicReport" className="form-select" value={formData.oldRadiographicReport} onChange={handleChange}>
                <option value="">Select Report Type</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT">CT</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lab / Blood Test Report</label>
              <select name="labBloodTestReport" className="form-select" value={formData.labBloodTestReport} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Y">Yes (Y)</option>
                <option value="N">No (N)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Previous Treatments */}
        <div className="form-section">
          <div className="form-section-title">Previous Treatments Received</div>
          <div className="checkbox-group">
            {PREVIOUS_TREATMENTS.map((treatment) => (
              <div key={treatment} className="checkbox-item">
                <input 
                  type="checkbox" 
                  id={`pt-${treatment}`} 
                  checked={formData.previousTreatment.includes(treatment)}
                  onChange={() => handleArrayChange('previousTreatment', treatment)}
                />
                <label htmlFor={`pt-${treatment}`}>{treatment.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Pain Areas */}
        <div className="form-section">
          <div className="form-section-title">Pain Area Localization</div>
          <p className="text-muted mb-4">Check active pain areas. Select R (Right) or L (Left) where applicable.</p>
          <div className="pain-area-grid">
            {PAIN_AREAS_LIST.map((pa) => (
              <div key={pa.key} className="pain-area-item">
                <span className="pain-area-name">{pa.label}</span>
                {pa.sides && (
                  <div className="pain-sides">
                    {(pa.customSides || ['R', 'L']).map((side) => (
                      <button
                        type="button"
                        key={side}
                        className={`side-btn ${isPainAreaSideActive(pa.key, side) ? 'active' : ''}`}
                        onClick={() => handlePainAreaSideToggle(pa.key, side)}
                      >
                        {side}
                      </button>
                    ))}
                  </div>
                )}
                {!pa.sides && (
                  <div className="pain-sides">
                    <button
                      type="button"
                      className={`side-btn ${isPainAreaSideActive(pa.key, 'Active') ? 'active' : ''}`}
                      onClick={() => handlePainAreaSideToggle(pa.key, 'Active')}
                    >
                      Yes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pain Characteristics */}
        <div className="form-section">
          <div className="form-section-title">Pain Characteristics & Daily Habits</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Duration</label>
              <select name="duration" className="form-select" value={formData.duration} onChange={handleChange}>
                <option value="">Select Duration</option>
                <option value="Acute">ACUTE</option>
                <option value="Chronic">CHRONIC</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nature of Pain</label>
              <select name="natureOfPain" className="form-select" value={formData.natureOfPain} onChange={handleChange}>
                <option value="">Select Nature</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sleep</label>
              <select name="sleep" className="form-select" value={formData.sleep} onChange={handleChange}>
                <option value="">Select Sleep</option>
                <option value="Disturbed">Disturbed</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Traveling (Km)</label>
              <input 
                type="text" 
                name="dailyKm" 
                className="form-input" 
                value={formData.dailyKm} 
                onChange={handleChange}
                placeholder="e.g. 15 km"
              />
            </div>
          </div>

          <div className="form-grid-2 mt-4">
            <div className="form-group">
              <label className="form-label">Types of Pain</label>
              <div className="checkbox-group">
                {TYPES_OF_PAIN.map((tp) => (
                  <div key={tp} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={`tp-${tp}`} 
                      checked={formData.typesOfPain.includes(tp)}
                      onChange={() => handleArrayChange('typesOfPain', tp)}
                    />
                    <label htmlFor={`tp-${tp}`}>{tp}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Stiffness Period</label>
              <div className="checkbox-group">
                {STIFFNESS_OPTIONS.map((st) => (
                  <div key={st} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={`st-${st}`} 
                      checked={formData.stiffness.includes(st)}
                      onChange={() => handleArrayChange('stiffness', st)}
                    />
                    <label htmlFor={`st-${st}`}>{st}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-grid-2 mt-4">
            <div className="form-group">
              <label className="form-label">Traveling Mode</label>
              <div className="checkbox-group">
                {TRAVELING_OPTIONS.map((tr) => (
                  <div key={tr} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={`tr-${tr}`} 
                      checked={formData.traveling.includes(tr)}
                      onChange={() => handleArrayChange('traveling', tr)}
                    />
                    <label htmlFor={`tr-${tr}`}>{tr}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Habits</label>
              <div className="checkbox-group">
                {HABITS.map((hb) => (
                  <div key={hb} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={`hb-${hb}`} 
                      checked={formData.habit.includes(hb)}
                      onChange={() => handleArrayChange('habit', hb)}
                    />
                    <label htmlFor={`hb-${hb}`}>{hb}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vitals & Clinical Conditions */}
        <div className="form-section">
          <div className="form-section-title">Vitals & Conditions</div>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Blood Pressure (BP)</label>
              <select name="bp" className="form-select" value={formData.bp} onChange={handleChange}>
                <option value="">Select BP Status</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Diabetes</label>
              <select name="diabetes" className="form-select" value={formData.diabetes ? "true" : "false"} onChange={(e) => setFormData(prev => ({...prev, diabetes: e.target.value === "true"}))}>
                <option value="false">No (Default)</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Genetic Condition (if any)</label>
              <input 
                type="text" 
                name="anyGeneticCondition" 
                className="form-input" 
                value={formData.anyGeneticCondition} 
                onChange={handleChange}
                placeholder="Describe condition"
              />
            </div>
          </div>
        </div>

        {/* Pain Scale Slider */}
        <div className="form-section">
          <div className="form-section-title">Pain Scale (0 - 10)</div>
          <div className="pain-scale-display">
            <input 
              type="range" 
              name="painScale" 
              min="0" 
              max="10" 
              className="w-full"
              value={formData.painScale} 
              onChange={handleChange}
              style={{ accentColor: 'var(--teal)' }}
            />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--navy)', width: '30px', textAlign: 'right' }}>
              {formData.painScale}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray-500)', marginTop: '4px' }}>
            <span>0 (No Pain)</span>
            <span>2 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>8 (Severe)</span>
            <span>10 (Very Severe)</span>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="form-section">
          <div className="form-section-title">Additional Consultation Notes</div>
          <div className="form-group">
            <textarea 
              name="notes" 
              className="form-textarea" 
              value={formData.notes} 
              onChange={handleChange}
              placeholder="Enter special therapist observations, precaution guidelines, etc."
            />
          </div>
        </div>

        <div className="divider"></div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              <FaSave />
              <span>{isEdit ? 'Update Record' : 'Save Patient Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ConsultationForm;
