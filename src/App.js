import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './Pages/auth/Login.tsx';
import Tasks from './Pages/Tasks/ViewTasks';
import TaskDetails from './Pages/Tasks/TaskDetails'; // Import TaskDetails
import ProtectedRoute from './Components/ProtectedRoute.tsx';
import TicketsPage from './Pages/Landing/LandingPage.tsx';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/Tasks" element={<Tasks />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<TicketsPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} /> {/* Add TaskDetails route */}

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
        </LocalizationProvider>
      </div>
    </Router>
  );
}

export default App;