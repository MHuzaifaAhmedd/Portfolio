const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Setup admin user
const setupAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      return;
    }
    
    // Create admin user
    const adminUser = await User.createAdmin(
      process.env.ADMIN_EMAIL || 'admin@huzaifa.dev',
      process.env.ADMIN_PASSWORD || 'admin123456',
      process.env.ADMIN_NAME || 'Huzaifa Ahmed'
    );
    
    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  }
};

// Setup database indexes
const setupIndexes = async () => {
  try {
    // Contact indexes
    const Contact = require('./models/Contact');
    await Contact.createIndexes();
    console.log('✅ Contact indexes created');
    
    // User indexes
    await User.createIndexes();
    console.log('✅ User indexes created');
    
  } catch (error) {
    console.error('❌ Failed to create indexes:', error.message);
  }
};

// Main setup function
const main = async () => {
  console.log('🚀 Starting portfolio backend setup...\n');
  
  try {
    await setupIndexes();
    await setupAdmin();
    
    console.log('\n✅ Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with real credentials');
    console.log('2. Start the server with: npm run dev');
    console.log('3. Test the API endpoints');
    console.log('4. Deploy to your preferred hosting platform');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { setupAdmin, setupIndexes };

