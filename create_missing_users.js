const axios = require('axios');

const createUser = async (userData, userType) => {
  try {
    console.log(`\n👤 Creating ${userType}...`);
    
    const response = await axios.post('http://localhost:5000/api/comptes/register', userData);
    
    console.log(`✅ ${userType} created successfully!`);
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.error(`❌ Error creating ${userType}:`, {
      status: error?.response?.status,
      message: error?.response?.data?.msg || error?.response?.data?.error,
      error: error?.message
    });
  }
};

const main = async () => {
  console.log('👥 Creating test users...\n');
  
  // Create test doctor
  await createUser({
    firstName: 'Test',
    lastName: 'Doctor',
    email: 'doctor@test.com',
    password: 'password123',
    phone: '+216 12 345 679',
    specialization: 'General',
    hospitalName: 'Test Hospital',
    hospitalAddress: '123 Hospital Street, Tunis',
    licenseNumber: 'DOC001',
    experience: 5,
    consultationFee: 50
  }, 'Doctor');
  
  // Create test pharmacist
  await createUser({
    name: 'Test Pharmacy',
    email: 'pharmacist@test.com',
    password: 'password123',
    phone: '+216 12 345 680',
    pharmacyName: 'Pharmacie Test',
    pharmacyAddress: '123 Pharmacy Street, Tunis',
    licenseNumber: 'PHARM001',
    coordinates: {
      lat: 36.8065,
      lng: 10.1815
    }
  }, 'Pharmacist');
  
  console.log('\n🏁 User creation completed');
  
  // Test login again
  console.log('\n🧪 Testing login after user creation...\n');
  
  const testLogin = async (email, password, userType) => {
    try {
      console.log(`\n🔐 Testing ${userType} login...`);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login successful!');
      console.log('📋 Response:', {
        status: response.status,
        hasToken: !!response.data.token,
        userRole: response.data.user?.role,
        userEmail: response.data.user?.email
      });
      
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error?.response?.status,
        message: error?.response?.data?.msg,
        error: error?.message
      });
    }
  };
  
  await testLogin('doctor@test.com', 'password123', 'Doctor');
  await testLogin('pharmacist@test.com', 'password123', 'Pharmacist');
};

main().catch(console.error);
