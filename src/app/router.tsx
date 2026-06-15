import {
  type Location,
  Outlet,
  type RouteObject,
  createBrowserRouter,
  useLocation,
  useNavigate,
  useRoutes
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

const AppLayout = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);

const pageRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ConstructorPage />
      },
      {
        path: 'feed',
        element: <Feed />
      },
      {
        path: 'feed/:number',
        element: (
          <div className={styles.detailPageWrap}>
            <OrderInfo />
          </div>
        )
      },
      {
        path: 'ingredients/:id',
        element: (
          <div className={styles.detailPageWrap}>
            <h2 className={`${styles.detailHeader} text text_type_main-large`}>
              Детали ингредиента
            </h2>
            <IngredientDetails />
          </div>
        )
      },
      {
        element: <AnonymousRoute />,
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />
          },
          {
            path: 'reset-password',
            element: <ResetPassword />
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'profile/orders',
            element: <ProfileOrders />
          },
          {
            path: 'profile/orders/:number',
            element: (
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            )
          }
        ]
      },
      {
        path: '*',
        element: <NotFound404 />
      }
    ]
  }
];

const modalRoutes: RouteObject[] = [
  {
    path: '/feed/:number',
    element: (
      <ModalWithNavigation title=''>
        <OrderInfo />
      </ModalWithNavigation>
    )
  },
  {
    path: '/ingredients/:id',
    element: (
      <ModalWithNavigation title='Детали ингредиента'>
        <IngredientDetails />
      </ModalWithNavigation>
    )
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/profile/orders/:number',
        element: (
          <ModalWithNavigation title=''>
            <OrderInfo />
          </ModalWithNavigation>
        )
      }
    ]
  }
];

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as TLocationState | null;
  const background = state?.background;
  const pages = useRoutes(pageRoutes, background || location);
  const modal = useRoutes(modalRoutes);

  return (
    <>
      {pages}
      {background && modal}
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />
  }
]);
