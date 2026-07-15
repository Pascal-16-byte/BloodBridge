import { Navigate, useLocation } from 'react-router-dom';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface px-5 pt-28">
        <div className="mx-auto max-w-7xl">
          <LoadingSkeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
