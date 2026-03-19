import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import FoodList from './pages/FoodList/FoodList';
import AddFood from './pages/AddFood/AddFood';
import EditFood from './pages/EditFood/EditFood';
import Profile from './pages/Profile/Profile';
import Error from './pages/Error/Error';
import Home from './pages/Home/Home';
import { useEffect } from 'react';
import { current } from './JS/Actions/user';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const dispatch = useDispatch()

 useEffect(()=> {
    if (localStorage.getItem("token")) {
      dispatch(current())
    } 
  },[dispatch])



  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/foodlist" element={<FoodList />} />
        <Route path="/addfood" element={<AddFood />} />
        <Route path="/editfood/:id" element={<EditFood />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;