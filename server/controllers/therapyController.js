const TherapySession = require('../models/TherapySession');
const Patient = require('../models/Patient');

// @desc    Get all therapy sessions for a patient
// @route   GET /api/patients/:patientId/therapy
const getTherapySessions = async (req, res) => {
  try {
    const sessions = await TherapySession.find({ patient: req.params.patientId })
      .sort({ date: 1, createdAt: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add therapy session
// @route   POST /api/patients/:patientId/therapy
const addTherapySession = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const count = await TherapySession.countDocuments({ patient: req.params.patientId });
    const session = new TherapySession({
      ...req.body,
      patient: req.params.patientId,
      srNo: count + 1,
    });
    const saved = await session.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update therapy session
// @route   PUT /api/therapy/:sessionId
const updateTherapySession = async (req, res) => {
  try {
    const session = await TherapySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    Object.assign(session, req.body);
    const saved = await session.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete therapy session
// @route   DELETE /api/therapy/:sessionId
const deleteTherapySession = async (req, res) => {
  try {
    const session = await TherapySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    await session.deleteOne();
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTherapySessions, addTherapySession, updateTherapySession, deleteTherapySession };
