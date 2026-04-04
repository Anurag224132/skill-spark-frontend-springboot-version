import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PageTransition from './components/common/PageTransition';

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

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
      <div className="min-h-screen bg-gray-50">
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
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
