import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EditUsers from './components/EditUsers';
import EditMatch from './components/EditMatch';
import EditProfile from './components/EditProfile';
import ReserveTicket from './components/ReserveTicket';
import VacantSeats from './components/VacantSeats'; // Import VacantSeats component
import ViewMatch from './components/ViewMatch'; // Import ViewMatch component
import EditMatchDetails from './components/EditMatchDetails'; // Import EditMatchDetails component
import AddStadium from './components/AddStadium'; // Import AddStadium component

function App() {
  const [authData, setAuthData] = useState({ token: null, userName: '', role: '', _id: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUserName = localStorage.getItem('userName');
    const savedRole = localStorage.getItem('role');
    const savedId = localStorage.getItem('_id');
    if (savedToken && savedUserName && savedRole && savedId) {
      setAuthData({ token: savedToken, userName: savedUserName, role: savedRole, _id: savedId });
    }
  }, []);

  const handleLogin = (newToken, newUserName, newRole, newId) => {
    setAuthData({ token: newToken, userName: newUserName, role: newRole, _id: newId });
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userName', newUserName);
    localStorage.setItem('role', newRole);
    localStorage.setItem('_id', newId); // Ensure _id is stored in localStorage
  };

  const handleLogout = () => {
    setAuthData({ token: null, userName: '', role: '', _id: '' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('_id'); // Ensure _id is removed from localStorage
  };

  return (
    <Router>
      <NavBar authData={authData} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/edit-users" element={<EditUsers />} />
        <Route path="/edit-matches" element={<EditMatch />} />
        <Route path="/edit-profile" element={<EditProfile authData={authData} />} />
        <Route path="/reserve-ticket" element={<ReserveTicket authData={authData} />} />
        <Route path="/vacant-seats/:matchId" element={<VacantSeats />} /> {/* Add route for VacantSeats */}
        <Route path="/view-match/:matchId" element={<ViewMatch />} /> {/* Add route for ViewMatch */}
        <Route path="/edit-match/:matchId" element={<EditMatchDetails />} /> {/* Add route for EditMatchDetails */}
        <Route path="/create-stadium" element={<AddStadium />} /> {/* Add route for AddStadium */}
      </Routes>
    </Router>
  );
}

export default App;