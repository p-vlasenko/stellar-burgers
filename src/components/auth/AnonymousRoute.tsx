import { Navigate, Outlet } from 'react-router-dom';

import { getCookie } from '../../utils/cookie';

export function AnonymousRoute() {
  const isAuthenticated =
    Boolean(getCookie('accessToken')) ||
    Boolean(localStorage.getItem('refreshToken'));

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
}
