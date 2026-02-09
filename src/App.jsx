import { useState } from 'react'
import './App.css'
import Dashboard from './components/dashboard'
import Contributions from './components/contribution'
import Navbar from './components/navbar'
import Query from './components/query'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './components/signin'
import SignUp from './components/signup'
import TechTeams from './components/techteam'
import MediaTeamDashboard from './components/media'
import DesignTeamDashboard from './components/design'
import TechLeadForms from './components/techlead'
import AdminDashboard from './components/admin'
import BootstrapData from './data/bootstrap'
import { useAuth } from './components/auth/authcontext'

function App() {
  const { auth, setAuth, loading: authLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-xl font-semibold text-indigo-600">
          Initializing Auth…
        </div>
      </div>
    );
  }

  return (
    <BootstrapData onReady={() => setIsReady(true)}>
      {!isReady ? (
        <div className="w-full h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-xl font-semibold text-indigo-600">
            Loading App…
          </div>
        </div>
      ) : (
        <Router>
          <Navbar auth={auth} setAuth={setAuth} />
          <Routes>
            <Route path="/Intellexa_core_fam/" element={<Dashboard />} />
            <Route path="/Intellexa_core_fam/contributions/teams" element={<Contributions />} />
            <Route path="/Intellexa_core_fam/query" element={<Query />} />
            <Route path="/Intellexa_core_fam/signin" element={<SignIn />} />
            <Route path="/Intellexa_core_fam/signup" element={<SignUp />} />

            {auth && auth.team === "Media" && <Route path="/Intellexa_core_fam/mediateam" element={<MediaTeamDashboard />} />}
            {auth && auth.team === "Design" && <Route path="/Intellexa_core_fam/designteam" element={<DesignTeamDashboard />} />}
            {auth && auth.team === "Intellexa" && auth.role === "Technical Lead" && <Route path="/Intellexa_core_fam/techlead" element={<TechLeadForms />} />}
            {auth && (auth.team === "Intellexa" || auth.team === "Event") && auth.role !== "Technical Lead" && <Route path="/Intellexa_core_fam/admin" element={<AdminDashboard />} />}

            {auth && (
              <>
                <Route path="/Intellexa_core_fam/techteams" element={<TechTeams />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/Intellexa_core_fam/" />} />
          </Routes>
        </Router>
      )}
    </BootstrapData>
  );
}

export default App
