import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Application from './pages/Application';
import Results from './pages/Results';
import SignUp from './pages/SignUp';

import Projects from './pages/Projects';
import SOPBuilder from './pages/SOPBuilder';
import CTA from './components/CTA';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderCTA = location.pathname === '/projects' ||
    location.pathname.startsWith('/sop-builder') ||
    location.pathname === '/apply' ||
    location.pathname === '/results';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeaderCTA && <Header />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {!hideHeaderCTA && <CTA />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<Application />} />
            <Route path="/results" element={<Results />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/sop-builder" element={<SOPBuilder />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
