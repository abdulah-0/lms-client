import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import StudyMaterials from './pages/StudyMaterials';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // <-- NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
        <Route path="/studymaterials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
