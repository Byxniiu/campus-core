import { Navigate } from 'react-router-dom';
import { useStudentAuthStore } from '../../stores/useStudentAuthStore';

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStudentAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/student-signin" replace />;
  }

  return children;
};

export default StudentProtectedRoute;
