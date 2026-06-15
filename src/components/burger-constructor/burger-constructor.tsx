import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';

import {
  selectIsOrderLoading,
  selectCurrentOrder,
  closeOrderModal as closeOrderAction,
  createOrder
} from '../../services/slices/orderSlice/orderSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import {
  constructorSelector,
  resetConstructor
} from '@slices/burger-constructor/burger-constructor-slice';
import { selectAccessToken } from '@slices/auth/auth-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(selectIsOrderLoading);
  const orderModalData = useSelector(selectCurrentOrder);
  const accessToken = useSelector(selectAccessToken);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!accessToken) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const itemsForApi = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(itemsForApi))
      .unwrap()
      .then(() => dispatch(resetConstructor()));
  };

  const closeOrderModal = () => {
    dispatch(closeOrderAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
