import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MatchesPage from '@/pages/MatchesPage';
import ProfileViewPage from '@/pages/ProfileViewPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import InterestsPage from '@/pages/InterestsPage';
import PricingPage from '@/pages/PricingPage';
import ProfileByIdPage from '@/pages/ProfileByIdPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import SecurityPage from '@/pages/SecurityPage';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/profile/view" element={<ProfileViewPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          <Route path="/profile/interests" element={<InterestsPage />} />
          <Route path="/profile/:id" element={<ProfileByIdPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          
          {/* Default fallbacks for common routes that might be linked */}
          <Route path="/profile" element={<ProfileViewPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
