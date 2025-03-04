import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './Pages/auth/Login.tsx';
import Tasks from './Pages/tasks/ViewTasks.tsx';
import ProtectedRoute from './Components/ProtectedRoute.tsx';
import TicketsPage from './Pages/Landing/LandingPage.tsx';




function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Tasks" element={<Tasks />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<TicketsPage />} />
               {/* Page that requires login (any logged-in user can access) */}
        {/* <Route
          path="/user"
          element={
            <ProtectedRoute requireLogin={true}>
              <UserPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Page that requires the user to be an admin */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute requireLogin={true} requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;