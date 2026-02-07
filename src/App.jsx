import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MCQTests from './pages/MCQTests';
import CodeEditor from './pages/CodeEditor';
import Results from './pages/Results';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Main layout (NO protection) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mcq-tests" element={<MCQTests />} />
          <Route path="code-editor" element={<CodeEditor />} />
          <Route path="results" element={<Results />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
