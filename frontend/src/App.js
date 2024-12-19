import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EditUsers from './components/EditUsers';
import EditMatch from './components/EditMatch';
import EditProfile from './components/EditProfile';
import ReserveTicket from './components/ReserveTicket';
import VacantSeats from './components/VacantSeats';
import ViewMatch from './components/ViewMatch';
import EditMatchDetails from './components/EditMatchDetails';
import AddStadium from './components/AddStadium';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute component

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
    localStorage.setItem('_id', newId);
  };

  const handleLogout = () => {
    setAuthData({ token: null, userName: '', role: '', _id: '' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('_id');
    window.location.href = '/'; // Redirect to main page on logout
  };

  return (
    <Router>
      <NavBar authData={authData} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/edit-users"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['admin']}>
              <EditUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-matches"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['manager']}>
              <EditMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['fan']}>
              <EditProfile authData={authData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserve-ticket"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['fan']}>
              <ReserveTicket authData={authData} />
            </ProtectedRoute>
          }
        />
        <Route path="/vacant-seats/:matchId" element={<VacantSeats />} />
        <Route path="/view-match/:matchId" element={<ViewMatch />} />
        <Route
          path="/edit-match/:matchId"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['manager']}>
              <EditMatchDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-stadium"
          element={
            <ProtectedRoute authData={authData} allowedRoles={['manager']}>
              <AddStadium />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;