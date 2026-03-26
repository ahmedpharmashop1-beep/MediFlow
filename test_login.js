const axios = require('axios');

const testLogin = async (email, password, userType) => {
  try {
    console.log(`\n🔐 Testing ${userType} login...`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    console.log('✅ Login successful!');
    console.log('📋 Response:', {
      status: response.status,
      hasToken: !!response.data.token,
      userRole: response.data.user?.role,
      userEmail: response.data.user?.email,
      userId: response.data.user?.id
    });
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Login failed:', {
      status: error?.response?.status,
      message: error?.response?.data?.msg,
      error: error?.message
    });
    return null;
  }
};

const main = async () => {
  console.log('🧪 Testing login functionality...\n');
  
  // Test admin (should work)
  await testLogin('admin@mediflow.com', 'Admin2024!', 'Admin');
  
  // Test patient
  await testLogin('patient@test.com', 'password123', 'Patient');
  
  // Test doctor
  await testLogin('doctor@test.com', 'password123', 'Doctor');
  
  // Test pharmacist
  await testLogin('pharmacist@test.com', 'password123', 'Pharmacist');
  
  console.log('\n🏁 Login testing completed');
};

main().catch(console.error);
