import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import MedicineReserve from './pages/MedicineReserve/MedicineReserve';
import PharmacyDashboard from './pages/PharmacyDashboard/PharmacyDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medicine-reserve" element={<MedicineReserve />} />
        <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

