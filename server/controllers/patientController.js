const Patient = require('../models/Patient');
const TherapySession = require('../models/TherapySession');

// @desc    Get all patients (with search)
// @route   GET /api/patients
const getPatients = async (req, res) => {
  try {
    const { search, date, page = 1, limit = 1000 } = req.query;
    let query = {};
    const conditions = [];

    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { contactNo: { $regex: search, $options: 'i' } },
          { caseNo: { $regex: search, $options: 'i' } },
          { diagnosis: { $regex: search, $options: 'i' } },
          { chiefComplaint: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      if (!isNaN(startOfDay.getTime())) {
        conditions.push({
          $or: [
            {
              dateOfExamination: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            },
            {
              createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          ]
        });
      }
    }

    if (conditions.length > 0) {
      query = conditions.length === 1 ? conditions[0] : { $and: conditions };
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('name caseNo contactNo age gender diagnosis dateOfExamination consultingDoctorName createdAt');
    res.json({ patients, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create patient
// @route   POST /api/patients
const createPatient = async (req, res) => {
  try {
    const patient = new Patient({ ...req.body, createdBy: req.user._id });
    const saved = await patient.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete patient and their therapy sessions
// @route   DELETE /api/patients/:id
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    await TherapySession.deleteMany({ patient: req.params.id });
    await patient.deleteOne();
    res.json({ message: 'Patient and all therapy sessions deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stats for dashboard
// @route   GET /api/patients/stats
const getStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todaySessions = await TherapySession.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name caseNo contactNo createdAt');
    res.json({ totalPatients, todaySessions, recentPatients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient, getStats };
