import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading
} from '@slices/profile-orders/profile-orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
