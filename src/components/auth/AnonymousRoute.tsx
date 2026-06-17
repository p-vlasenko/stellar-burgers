import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from '@store';
import {
  selectAccessToken,
  selectIsAuthChecked
} from '@slices/auth/auth-slice';
import { Preloader } from '../ui/preloader/preloader';

export function AnonymousRoute() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return accessToken ? <Navigate to='/' replace /> : <Outlet />;
}
