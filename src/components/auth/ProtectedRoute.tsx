import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectIsAuthChecked
} from '@slices/auth/auth-slice';
import { Preloader } from '../ui/preloader/preloader';

export function ProtectedRoute() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return accessToken ? <Outlet /> : <Navigate to='/login' replace />;
}
