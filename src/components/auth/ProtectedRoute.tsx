import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '@store';
import {
  selectAccessToken,
  selectIsAuthChecked
} from '@slices/auth/auth-slice';
import { Preloader } from '../ui/preloader/preloader';

export function ProtectedRoute() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
}
