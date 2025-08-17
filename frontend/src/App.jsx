import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { PopupProvider } from './components/Popup';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OrganizerDashboard from './pages/OrganizerDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import TournamentDetails from './pages/TournamentDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <PopupProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route path="/organizer" element={
                <ProtectedRoute role="organizer">
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/participant" element={
                <ProtectedRoute role="participant">
                  <ParticipantDashboard />
                </ProtectedRoute>
              } />

              <Route path="/tournaments/:id" element={<TournamentDetails />} />
            </Routes>
          </div>
        </ToastProvider>
      </PopupProvider>
    </AuthProvider>
  );
}

export default App;
