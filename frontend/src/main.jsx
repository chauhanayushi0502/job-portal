import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import LoginForm from "./Login.jsx";
import App from "./App.jsx";
import CompanyHome from "./companyhome.jsx";
import Job from "./candidatehome.jsx";
import Applyjob from "./apply.jsx";
import Profile from "./profile.jsx";
import Showjob from "./companyjob.jsx";
import ApplyHistory from "./applyhis.jsx";
import Can_apply from "./whoapply"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Job" element={<Job />} />
        <Route path="/Applyjob" element={<Applyjob />} />
        <Route path="/ApplyHistory" element={<ApplyHistory/>}/>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Showjob" element={<Showjob />} />
        <Route path="/CompanyHome" element={<CompanyHome />} />
        <Route path="/Can_apply" element={<Can_apply/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
