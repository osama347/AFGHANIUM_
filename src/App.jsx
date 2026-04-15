import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingBar from './components/LoadingBar';
import PageTransition from './components/PageTransition';
import BackToTop from './components/BackToTop';

// Pages
import Home from './pages/Home';
import Donate from './pages/Donate';
import TrackDonation from './pages/TrackDonation';
import ImpactStories from './pages/ImpactStories';
import Products from './pages/Products';
import Research from './pages/Research';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import DonationSuccess from './pages/DonationSuccess';
import DebugStats from './pages/DebugStats';
import AdminPage from './pages/AdminPage';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminDashboardPage from './components/Admin/AdminDashboardPage';
import DonationsList from './components/Admin/DonationsList';
import ImpactList from './components/Admin/ImpactList';
import AdminInbox from './components/Admin/AdminInbox';
import AdminSettings from './components/Admin/AdminSettings';
import AdminContent from './components/Admin/AdminContent';
import AdminEmergency from './components/Admin/AdminEmergency';
import AdminResearch from './components/Admin/AdminResearch';
import AdminProducts from './components/Admin/AdminProducts';

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <PageTransition>
        {children}
      </PageTransition>
    </main>
    <Footer />
    <BackToTop />
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
          <LoadingBar />
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
            <Route path="/donation-success" element={<PublicLayout><DonationSuccess /></PublicLayout>} />
            <Route path="/debug" element={<DebugStats />} />
            <Route path="/track" element={<PublicLayout><TrackDonation /></PublicLayout>} />
            <Route path="/impact" element={<PublicLayout><ImpactStories /></PublicLayout>} />
            <Route path="/shop" element={<Products />} />
            <Route path="/products" element={<Navigate to="/shop" replace />} />
            <Route path="/research" element={<PublicLayout><Research /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

            {/* Admin Routes (No Layout) */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="donations" element={<DonationsList />} />
              <Route path="impacts" element={<ImpactList />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="emergency" element={<AdminEmergency />} />
              <Route path="research" element={<AdminResearch />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
