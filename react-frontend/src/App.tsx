import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Halls from './pages/Halls';
import ExamSchedule from './pages/ExamSchedule';
import Allocation from './pages/Allocation';
import AllocationResult from './pages/AllocationResult';
import StudentPortal from './pages/StudentPortal';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/halls" element={<Halls />} />
      <Route path="/schedule" element={<ExamSchedule />} />
      <Route path="/allocation" element={<Allocation />} />
      <Route path="/allocation-result" element={<AllocationResult />} />
      <Route path="/student-portal" element={<StudentPortal />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
