import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CertificateLibraryPage from './pages/CertificateLibraryPage';
import ProfileCreationPage from './pages/ProfileCreation/ProfileCreationPage';

// Protected Route Component
const ProtectedRoute = ({ children, requireProfileCompletion = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if profile completion is required and user hasn't completed it
  if (requireProfileCompletion && !user.isProfileComplete) {
    return <Navigate to="/profile-creation" />;
  }

  return children;
};


// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // If user is logged in but hasn't completed profile, redirect to profile creation
    if (!user.isProfileComplete) {
      return <Navigate to="/profile-creation" />;
    }
    // If user is logged in and has completed profile, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Layout wrapper component to conditionally render navbar and footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Routes that should not have navbar and footer
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => location.pathname.startsWith(route));

  if (isAuthRoute) {
    return (
      <div className="app">
        <main className="main-content">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <LayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email"
                element={<EmailVerificationPage />}
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <CertificateLibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-creation"
                element={
                  <ProtectedRoute>
                    <ProfileCreationPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
