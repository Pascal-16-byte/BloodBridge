import { AnimatePresence } from 'framer-motion';
import { useLocation, useRoutes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import AboutPage from '../pages/AboutPage';
import ActiveRequestsPage from '../pages/ActiveRequestsPage';
import BecomeDonorPage from '../pages/BecomeDonorPage';
import ContactPage from '../pages/ContactPage';
import DashboardPage from '../pages/DashboardPage';
import CreateRequestPage from '../pages/CreateRequestPage';
import EditRequestPage from '../pages/EditRequestPage';
import FAQPage from '../pages/FAQPage';
import FindDonorsPage from '../pages/FindDonorsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import EditProfilePage from '../pages/EditProfilePage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import MyRequestsPage from '../pages/MyRequestsPage';
import RequestDetailsPage from '../pages/RequestDetailsPage';

function AnimatedRoutes() {
  const location = useLocation();
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'donor', element: <BecomeDonorPage /> },
        { path: 'become-donor', element: <BecomeDonorPage /> },
        { path: 'find-donors', element: <FindDonorsPage /> },
        { path: 'active-requests', element: <ActiveRequestsPage /> },
        { path: 'requests/feed', element: <ActiveRequestsPage /> },
        {
          path: 'emergency-request',
          element: (
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'request-blood',
          element: (
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'requests',
          element: (
            <ProtectedRoute>
              <MyRequestsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'requests/:id',
          element: (
            <ProtectedRoute>
              <RequestDetailsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'requests/:id/edit',
          element: (
            <ProtectedRoute>
              <EditRequestPage />
            </ProtectedRoute>
          ),
        },
        { path: 'contact', element: <ContactPage /> },
        { path: 'faq', element: <FAQPage /> },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile/edit',
          element: (
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          ),
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    { path: ROUTES.login, element: <LoginPage /> },
    { path: ROUTES.register, element: <RegisterPage /> },
    { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
  ]);

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>{element}</div>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return <AnimatedRoutes />;
}
