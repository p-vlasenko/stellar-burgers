import {
  type Location,
  Outlet,
  Route,
  Routes,
  createBrowserRouter,
  useLocation,
  useNavigate
} from 'react-router-dom';
import type { ReactNode } from 'react';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../index.css';
import styles from '../components/app/app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { useSelector } from '@store';
import { selectIsAuthChecked } from '@slices/auth/auth-slice';
import { selectIngredientsIsLoading } from '@slices/ingredients/ingredients-slice';
import { AnonymousRoute } from '../components/auth/AnonymousRoute';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

type TLocationState = {
  background?: Location;
};

const ModalWithNavigation = ({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <Modal title={title} onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
};

const AppLayout = ({ isLoading }: { isLoading: boolean }) => (
  <div className={styles.app}>
    <AppHeader />
    {isLoading ? <Preloader /> : <Outlet />}
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const isIngredientsLoading = useSelector(selectIngredientsIsLoading);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const state = location.state as TLocationState | null;
  const background = state?.background;
  const isAppLoading = isIngredientsLoading || !isAuthChecked;

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<AppLayout isLoading={isAppLoading} />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route
            path='feed/:number'
            element={
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            }
          />
          <Route
            path='ingredients/:id'
            element={
              <div className={styles.detailPageWrap}>
                <h2
                  className={`${styles.detailHeader} text text_type_main-large`}
                >
                  Детали ингредиента
                </h2>
                <IngredientDetails />
              </div>
            }
          />

          <Route element={<AnonymousRoute />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='profile' element={<Profile />} />
            <Route path='profile/orders' element={<ProfileOrders />} />
            <Route
              path='profile/orders/:number'
              element={
                <div className={styles.detailPageWrap}>
                  <OrderInfo />
                </div>
              }
            />
          </Route>

          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      {background && !isAppLoading && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ModalWithNavigation title=''>
                <OrderInfo />
              </ModalWithNavigation>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalWithNavigation title='Детали ингредиента'>
                <IngredientDetails />
              </ModalWithNavigation>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <ModalWithNavigation title=''>
                  <OrderInfo />
                </ModalWithNavigation>
              }
            />
          </Route>
        </Routes>
      )}
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />
  }
]);
