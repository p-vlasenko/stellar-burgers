import { Navigate, Outlet } from 'react-router-dom';

import { getCookie } from '../../utils/cookie';

export function ProtectedRoute() {
  const isAuthenticated =
    Boolean(getCookie('accessToken')) ||
    Boolean(localStorage.getItem('refreshToken'));

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
}
