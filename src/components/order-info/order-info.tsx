import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '@store';
import { selectAllIngredients } from '@slices/ingredients/ingredients-slice';
import {
  fetchProfileOrderByNumber,
  ordersInfoDataSelector
} from '@slices/profile-orders/profile-orders-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const itemNum = number ? parseInt(number) : undefined;
  const dispatch = useDispatch();

  const ingredients = useSelector(selectAllIngredients);

  const [orderData, setOrderData] = useState<TOrder | undefined>();

  const orderFromStore = useSelector(ordersInfoDataSelector(itemNum));

  useEffect(() => {
    if (!orderFromStore && itemNum) {
      dispatch(fetchProfileOrderByNumber(itemNum));
    }
  }, [dispatch, number, orderFromStore]);

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
    }
  }, [orderFromStore]);

  const orderInfo =
    orderData && ingredients.length
      ? (() => {
          const date = new Date(orderData.createdAt);

          type TIngredientsWithCount = Record<
            string,
            TIngredient & { count: number }
          >;

          const ingredientsInfo =
            orderData.ingredients.reduce<TIngredientsWithCount>((acc, item) => {
              const ingredient = ingredients.find((ing) => ing._id === item);

              if (!ingredient) {
                return acc;
              }

              if (!acc[item]) {
                acc[item] = { ...ingredient, count: 1 };
              } else {
                acc[item].count++;
              }

              return acc;
            }, {});

          const total = Object.values(ingredientsInfo).reduce(
            (acc, item) => acc + item.price * item.count,
            0
          );

          return {
            ...orderData,
            ingredientsInfo,
            date,
            total
          };
        })()
      : null;

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
