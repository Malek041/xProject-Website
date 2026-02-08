import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Application from './pages/Application';
import Results from './pages/Results';
import SignUp from './pages/SignUp';

// import Projects from './pages/Projects';
import SOPBuilder from './pages/SOPBuilder';
import CTA from './components/CTA';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireApplication = true }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/signup" />;

  if (requireApplication && currentUser.hasCompletedApplication === false) {
    return <Navigate to="/application" />;
  }

  return children;
};
import FrameworkDetail from './pages/FrameworkDetail';

const Layout = ({ children }) => {
  const location = useLocation();
  const isSOPBuilder = location.pathname.startsWith('/sop-builder');
  const isMinimalPage = ['/signup', '/application', '/results'].includes(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isSOPBuilder && <Header minimal={isMinimalPage} />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {!isSOPBuilder && !isMinimalPage && <CTA />}
    </div>
  );
};

import LaptopOnly from './components/LaptopOnly';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/application" element={
                  <ProtectedRoute requireApplication={false}>
                    <Application />
                  </ProtectedRoute>
                } />
                <Route path="/results" element={<Results />} />
                <Route path="/signup" element={<SignUp />} />
                {/* <Route path="/projects" element={<Projects />} /> */}
                <Route path="/sop-builder" element={
                  <ProtectedRoute>
                    <LaptopOnly>
                      <SOPBuilder />
                    </LaptopOnly>
                  </ProtectedRoute>
                } />
                <Route path="/framework/:id" element={<FrameworkDetail />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
