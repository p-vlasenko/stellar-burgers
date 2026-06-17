import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '@store';
import {
  selectAccessToken,
  selectIsAuthChecked
} from '@slices/auth/auth-slice';
import { Preloader } from '../ui/preloader/preloader';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export function AnonymousRoute() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname ?? '/';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return accessToken ? <Navigate to={from} replace /> : <Outlet />;
}
