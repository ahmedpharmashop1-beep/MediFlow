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
      userId: response.data.user?.id,
      userName: response.data.user?.name || `${response.data.user?.firstName} ${response.data.user?.lastName}`
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
  console.log('🧪 Testing login with existing users from database...\n');
  
  // Test existing patients from database
  await testLogin('ghada.gh@gmail.com', 'password123', 'Patient (Ghada)');
  await testLogin('ahmed.tech@gmail.com', 'password123', 'Patient (Ahmed)');
  await testLogin('aymen.tech@gmail.com', 'password123', 'Patient (Aymen)');
  
  // Test existing doctors
  await testLogin('medecin@test.com', 'password123', 'Doctor');
  await testLogin('aida.khouaja@gmail.com', 'password123', 'Doctor (Aida)');
  
  // Test existing pharmacists
  await testLogin('ahmed.benali@pharmacie.tn', 'password123', 'Pharmacist (Ahmed)');
  await testLogin('fatma.mansouri@pharmacie.tn', 'password123', 'Pharmacist (Fatma)');
  
  // Test admin
  await testLogin('admin@mediflow.com', 'Admin2024!', 'Admin');
  
  console.log('\n🏁 Login testing completed');
};

main().catch(console.error);
