const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const TherapySession = require('./models/TherapySession');

dotenv.config();

const patientsMockData = [
  {
    caseNo: "C-2026-001",
    consultingDoctorName: "Dr. A. K. Sharma",
    dateOfExamination: new Date("2026-05-10"),
    name: "Aarav Mehta",
    dob: new Date("1988-08-12"),
    gender: "Male",
    address: "Flat 402, Green Ridge Apartments, Mumbai",
    age: "38",
    occupationWork: "Software Engineer (Desk Job)",
    maritalStatus: "Married",
    contactNo: "+91 98765 43210",
    referredBy: "Self",
    chiefComplaint: "Severe lower back stiffness and radiating pain down the right thigh for past 3 weeks. Aggravated by prolonged sitting.",
    diagnosis: "L4-L5 Lumbar Disc Bulge with Sciatica",
    oldRadiographicReport: "Y",
    labBloodTestReport: "N",
    previousTreatment: ["Allopathic", "Physiotherapy"],
    painAreas: [
      { area: "BackLower", sides: [] },
      { area: "Thigh", sides: ["R"] },
      { area: "Calf", sides: ["R"] }
    ],
    duration: "Acute",
    natureOfPain: "Severe",
    typesOfPain: ["Ache/Dull", "Numb/Tingling", "Sharp/Stabbing"],
    stiffness: ["Morning", "Evening"],
    sleep: "Disturbed",
    traveling: ["4 Wheeler"],
    dailyKm: "20 km",
    habit: ["Alcohol"],
    bp: "125/82",
    diabetes: false,
    anyGeneticCondition: "None",
    painScale: 8,
    notes: "Patient advised to avoid forward bending and heavy lifting. Recommend core stabilization exercises, lumbar traction, and IFT."
  },
  {
    caseNo: "C-2026-002",
    consultingDoctorName: "Dr. Priya Patel",
    dateOfExamination: new Date("2026-05-18"),
    name: "Meera Nair",
    dob: new Date("1974-03-24"),
    gender: "Female",
    address: "Row House No. 8, Clover Park, Pune",
    age: "52",
    occupationWork: "Homemaker",
    maritalStatus: "Married",
    contactNo: "+91 98230 12345",
    referredBy: "Dr. Rajesh Shah (Ortho)",
    chiefComplaint: "Stiffness and dull pain in bilateral shoulder joints. Inability to lift overhead objects or sleep on either side.",
    diagnosis: "Adhesive Capsulitis (Bilateral Frozen Shoulder)",
    oldRadiographicReport: "Y",
    labBloodTestReport: "Y",
    previousTreatment: ["Medication", "Ayurvedic"],
    painAreas: [
      { area: "Shoulder", sides: ["R", "L"] },
      { area: "Arm", sides: ["R", "L"] }
    ],
    duration: "Chronic",
    natureOfPain: "Moderate",
    typesOfPain: ["Ache/Dull", "Pins/Needles"],
    stiffness: ["Morning", "Whole Day"],
    sleep: "Disturbed",
    traveling: ["Local Transport"],
    dailyKm: "5 km",
    habit: [],
    bp: "138/88",
    diabetes: true,
    anyGeneticCondition: "None",
    painScale: 6,
    notes: "Patient is diabetic (HbA1c: 7.4). Healing might be slower. Start with active assisted shoulder mobilization, hot packs, and ultrasound therapy."
  }
];

const sessionsMockData = [
  // Aarav Mehta Sessions
  [
    {
      date: new Date("2026-05-10"),
      physiotherapyTreatment: "Lumbar traction (15 mins), IFT for lower back pain, gentle cat-camel stretches.",
      treatmentCost: 45,
      paid: 45,
      ptSign: "SK",
      day: "Sunday"
    },
    {
      date: new Date("2026-05-12"),
      physiotherapyTreatment: "Lumbar traction (20 mins), IFT, transverse friction massage. Radiating pain reduced.",
      treatmentCost: 45,
      paid: 45,
      ptSign: "SK",
      day: "Tuesday"
    },
    {
      date: new Date("2026-05-15"),
      physiotherapyTreatment: "Lumbar traction, Core activation exercises (Prone bracing, Bridging). Pain scale down to 5/10.",
      treatmentCost: 45,
      paid: 0,
      ptSign: "SK",
      day: "Friday"
    }
  ],
  // Meera Nair Sessions
  [
    {
      date: new Date("2026-05-18"),
      physiotherapyTreatment: "Shoulder ultrasound therapy, hot packs (10 mins), passive stretching in pain-free range.",
      treatmentCost: 40,
      paid: 40,
      ptSign: "PR",
      day: "Monday"
    },
    {
      date: new Date("2026-05-20"),
      physiotherapyTreatment: "Ultrasound, hot pack, Codman's pendulum exercises, pulley mobilization.",
      treatmentCost: 40,
      paid: 40,
      ptSign: "PR",
      day: "Wednesday"
    }
  ]
];

const seedPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for patient seeding...');

    // Clear existing patient records to start fresh
    await Patient.deleteMany({ name: { $in: ["Aarav Mehta", "Meera Nair"] } });

    const admin = await User.findOne({ email: 'admin@sfcc.com' });
    if (!admin) {
      console.error('Admin user not found. Please run "npm run seed" first.');
      process.exit(1);
    }

    for (let i = 0; i < patientsMockData.length; i++) {
      const patientData = {
        ...patientsMockData[i],
        createdBy: admin._id
      };
      
      const patient = await Patient.create(patientData);
      console.log(`✅ Created Patient: ${patient.name} (ID: ${patient._id})`);

      // Add therapy sessions
      const sessions = sessionsMockData[i].map((session, index) => ({
        ...session,
        patient: patient._id,
        srNo: index + 1
      }));

      await TherapySession.insertMany(sessions);
      console.log(`   └─ Added ${sessions.length} therapy sessions`);
    }

    console.log('🎉 Patient seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Patient seed error:', error.message);
    process.exit(1);
  }
};

seedPatients();
