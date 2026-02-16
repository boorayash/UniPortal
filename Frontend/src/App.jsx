import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './authorization/login'
import AdminDashboard from './admin/adminDashboard'
import Departments from "./admin/departmentPage";
import Users from "./admin/userPage";
import AddUserPopup from './admin/addUserPopup';
import StudentDashboard from './students/studentDashboard';
import StudentAssignments from "./students/studentAssignment";
import UploadAssignment from "./students/uploadAssignmentPopup";
import EditResubmitPopup from "./students/editResubmitPopup";
import ProfessorDashboard from './professors/professorDashboard';
import ProfessorAssignments from './professors/professorAssignment';
import ReviewAssignment from './professors/professorReviewAssignment';


function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/add" element={<AddUserPopup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/assignments/upload" element={<UploadAssignment />} />
        <Route path="/student/assignments/:id/edit" element={<EditResubmitPopup />} />
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/assignments" element={<ProfessorAssignments />} />
        <Route path="/professor/assignments/:id/review" element={<ReviewAssignment />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App
