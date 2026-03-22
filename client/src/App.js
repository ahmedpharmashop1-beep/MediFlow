import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import MedicineReserve from './pages/MedicineReserve/MedicineReserve';
import PharmacyDashboard from './pages/PharmacyDashboard/PharmacyDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import Appointments from './pages/Appointments/Appointments';
import CnamTracking from './pages/CnamTracking/CnamTracking';
import Doctors from './pages/Doctors/Doctors';
import Hospitals from './pages/Hospitals/Hospitals';
import CNAM from './pages/CNAM/CNAM';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <NavBar />
      
      <Routes>
        {/* Public Routes without Sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/cnam" element={<CNAM />} />
        <Route path="/medicine-reserve" element={<MedicineReserve />} />
        
        {/* Centralized Layout containing Categories and Modules */}
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/pharmacy-dashboard" element={<DashboardLayout><PharmacyDashboard /></DashboardLayout>} />
        <Route path="/doctor-dashboard" element={<DashboardLayout><DoctorDashboard /></DashboardLayout>} />
        <Route path="/appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
        <Route path="/cnam-tracking" element={<DashboardLayout><CnamTracking /></DashboardLayout>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

