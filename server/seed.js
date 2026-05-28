const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    const existing = await User.findOne({ email: 'admin@sfcc.com' });
    if (existing) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    await User.create({
      name: 'SFCC Admin',
      email: 'admin@sfcc.com',
      password: 'sfcc1234',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email   : admin@sfcc.com');
    console.log('   Password: sfcc1234');
    console.log('   ⚠️  Please change this password after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
