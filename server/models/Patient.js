const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Header Info
  caseNo: { type: String, trim: true },
  consultingDoctorName: { type: String, trim: true },
  dateOfExamination: { type: Date },

  // Personal Info
  name: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  address: { type: String, trim: true },
  age: { type: String, trim: true },
  occupationWork: { type: String, trim: true },
  maritalStatus: { type: String, enum: ['Married', 'Unmarried', ''], default: '' },
  contactNo: { type: String, trim: true },
  referredBy: { type: String, trim: true },

  // Clinical
  chiefComplaint: { type: String, trim: true },
  diagnosis: { type: String, trim: true },
  oldRadiographicReport: { type: String, enum: ['Y', 'N', ''], default: '' },
  labBloodTestReport: { type: String, enum: ['Y', 'N', ''], default: '' },

  // Previous Treatment (array of selected options)
  previousTreatment: [{
    type: String,
    enum: ['Allopathic', 'Ayurvedic', 'Homeopathic', 'Physiotherapy', 'Medication', 'Surgery', 'Injection', 'Others', 'None']
  }],

  // Pain Areas - each with body part and side
  painAreas: [{
    area: { type: String },
    sides: [{ type: String, enum: ['R', 'L'] }]
  }],

  // Pain Characteristics
  duration: { type: String, enum: ['Acute', 'Chronic', ''], default: '' },
  natureOfPain: { type: String, enum: ['Mild', 'Moderate', 'Severe', ''], default: '' },
  typesOfPain: [{
    type: String,
    enum: ['Ache/Dull', 'Numb/Tingling', 'Burning/Throbbing', 'Sharp/Stabbing', 'Pins/Needles', 'Others']
  }],
  stiffness: [{
    type: String,
    enum: ['Morning', 'Evening', 'Night', 'Whole Day']
  }],
  sleep: { type: String, enum: ['Disturbed', 'Normal', ''], default: '' },
  traveling: [{
    type: String,
    enum: ['2 Wheeler', '4 Wheeler', 'Local Transport']
  }],
  dailyKm: { type: String, trim: true },
  habit: [{
    type: String,
    enum: ['Smoking', 'Alcohol', 'Tobacco', 'Others']
  }],

  // Vitals
  bp: { type: String, trim: true },
  diabetes: { type: Boolean, default: false },
  anyGeneticCondition: { type: String, trim: true },

  // Pain Scale
  painScale: { type: Number, min: 0, max: 10 },

  // Additional Notes
  notes: { type: String, trim: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Text index for search
patientSchema.index({ name: 'text', contactNo: 'text', caseNo: 'text', diagnosis: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
