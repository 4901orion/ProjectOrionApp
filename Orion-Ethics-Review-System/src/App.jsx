import {Routes, Route, Outlet} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FinalDecisions from './pages/FinalDecisions';
import All_Applications from './pages/All_Applications';
import FormBuilder from './pages/FormBuilder';
import reports_metrics from './pages/reports_metrics';
import audit_log from './pages/audit_log';

import NavBar from './components/NavBar';
import Header from './components/Header';
import './App.css';

function Layout() {
  return (
    <div className="app-wrapper">
      {/* Header sits at the top */}
      <Header />
      
      {/* Main area holds the NavBar (sidebar) and Content */}
      <div className="d-flex align-items-start">
        <NavBar />

      <main className="app-content">
          {/* The <Outlet /> is where the page content will render based on the URL */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="final-decisions" element={<FinalDecisions />} />
        <Route path="applications" element={<All_Applications />} />
        <Route path="form-builder" element={<FormBuilder />} />
        <Route path="reports-metrics" element={<reports_metrics />} />
        <Route path="audit-log" element={<audit_log />} />
      </Route>
    </Routes>
  );
}
export default App;