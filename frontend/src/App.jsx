import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import CompanyPanel from "./CompanyPanel";
import CandidatePanel from "./CandidatePanel";
import JobApplications from "./JobApplications";
import Navbar from "./Navbar";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoute";
import Login from "./login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthRoutes />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/company"
            element={
              <>
                <Navbar />
                <CompanyPanel />
              </>
            }
          />
          <Route
            path="/candidate"
            element={
              <>
                <Navbar />
                <CandidatePanel />
              </>
            }
          />
          <Route
            path="/applications/:jobId"
            element={
              <>
                <Navbar />
                <JobApplications />
              </>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/Login" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;