const mongoose = require('mongoose');

const therapySessionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  srNo: { type: Number },
  date: { type: Date, required: true, default: Date.now },
  physiotherapyTreatment: { type: String, trim: true },
  treatmentCost: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  treatmentDay: { type: String, trim: true },
}, { timestamps: true });

// Auto-calculate balance before save
therapySessionSchema.pre('save', function () {
  this.balance = (this.treatmentCost || 0) - (this.paid || 0);
});

module.exports = mongoose.model('TherapySession', therapySessionSchema);
