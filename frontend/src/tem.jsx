import React from 'react';
import Register from './Register';
import Login from './Login';
import CompanyPanel from './CompanyPanel';
import CandidatePanel from './CandidatePanel';
import JobApplications from './JobApplications';
import Navbar from './Navbar';

function App() {
  const path = window.location.pathname;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (path === '/login') return <Login />;
  if (path === '/register') return <Register />;

  if (path === '/company') {
    return (
      <>
        <Navbar />
        <CompanyPanel />
      </>
    );
  }

  if (path === '/candidate') {
    return (
      <>
        <Navbar />
        <CandidatePanel />
      </>
    );
  }

  if (path.startsWith('/applications/')) {
    return (
      <>
        <Navbar />
        <JobApplications />
      </>
    );
  }

  if (token && user.role === 'company') {
    window.location.href = '/company';
    return null;
  }

  if (token && user.role === 'candidate') {
    window.location.href = '/candidate';
    return null;
  }

  return (
    <div style={styles.container}>
      <h1>Welcome to Job Portal</h1>
      <p style={styles.subtitle}>Find your dream job or hire the best talent</p>
      <div style={styles.linkContainer}>
        <a href="/register" style={styles.link}>Register</a>
        <a href="/login" style={styles.link}>Login</a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px'
  },
  linkContainer: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

export default App;