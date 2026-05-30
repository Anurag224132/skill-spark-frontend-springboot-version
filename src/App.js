import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PageTransition from './components/common/PageTransition';
import { Toaster } from 'react-hot-toast';
import DashboardBackground from './components/common/DashboardBackground';

// Lazy load components for code splitting
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const HomePage = lazy(() => import('./pages/HomePage'));
const RecentJobsPage = lazy(() => import('./components/student/RecentJobsPage'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const ContactUs = lazy(() => import('./pages/ContactUs'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

const DashboardRouter = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoadingFallback />;
  }

  if (currentUser.role === 'recruiter' || currentUser.role === 'RECRUITER') {
    return <RecruiterDashboard />;
  } else if (currentUser.role === 'admin' || currentUser.role === 'ADMIN') {
    return <AdminDashboard />;
  } else if (currentUser.role === 'student' || currentUser.role === 'STUDENT') {
    return <StudentDashboard />;
  } else {
    return (
      <div className="text-center mt-10 text-red-600">
        Unauthorized: Unknown user role ({currentUser.role}).
      </div>
    );
  }
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 16, 29, 0.85)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
            fontSize: '0.875rem',
            padding: '12px 18px',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#0a101d',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0a101d',
            },
          },
        }}
      />
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#050B14] dark:text-white transition-colors duration-300 relative">
        {/* Global fixed background is rendered at the top level to stay fixed to the viewport.
            This avoids nested page containers with transforms/filters (like PageTransition) 
            breaking its 'position: fixed' layout context. */}
        <DashboardBackground />

        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path='/' element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <PageTransition>
                      <DashboardRouter />
                    </PageTransition>
                  </PrivateRoute>
                }
              />
              <Route path="/recent-jobs" element={<PageTransition><RecentJobsPage /></PageTransition>} />
              <Route path="/student/dashboard" element={<PageTransition><StudentDashboard /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactUs /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
