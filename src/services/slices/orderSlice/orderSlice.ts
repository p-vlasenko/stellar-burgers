import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  GetOrderByNumberExtra,
  OrderBurgerExtra,
  RejectsToStr
} from '../../types';

type TOrderState = {
  currentOrder?: TOrder;
  orderNumber?: number;
  isOrderLoading: boolean;
  error?: string;
};

export const initialState: TOrderState = {
  isOrderLoading: false
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const ORDER_SLICE_NAME = 'order';

const setPendingState = (state: TOrderState) => {
  state.isOrderLoading = true;
  state.error = undefined;
};

const setRejectedState = (state: TOrderState, payload: unknown) => {
  state.isOrderLoading = false;
  state.error = typeof payload === 'string' ? payload : 'Неизвестная ошибка';
};

export const makeOrderSlice = (state = initialState) =>
  createSliceWithThunks({
    name: ORDER_SLICE_NAME,
    initialState: state,
    selectors: {
      selectCurrentOrder: (state) => state.currentOrder,
      selectIsOrderLoading: (state) => state.isOrderLoading
    },
    reducers: (create) => ({
      closeOrderModal: create.reducer((state) => {
        state.currentOrder = undefined;
        state.orderNumber = undefined;
        state.isOrderLoading = false;
        state.error = undefined;
      }),

      createOrder: create.asyncThunk<
        string[],
        TOrder,
        RejectsToStr & OrderBurgerExtra
      >(
        async (ingredients, { rejectWithValue, extra: { orderBurger } }) => {
          try {
            if (!ingredients || ingredients.length === 0) {
              return rejectWithValue('Нет ингредиентов для заказа');
            }

            const response = await orderBurger(ingredients);

            return response.order;
          } catch (err) {
            return rejectWithValue('Ошибка создания заказа');
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isOrderLoading = false;
            state.currentOrder = action.payload;
            state.orderNumber = action.payload.number;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
          }
        }
      ),

      fetchOrderByNumber: create.asyncThunk<
        number,
        TOrder,
        RejectsToStr & GetOrderByNumberExtra
      >(
        async (
          orderNumber,
          { rejectWithValue, extra: { getOrderByNumber } }
        ) => {
          try {
            const response = await getOrderByNumber(orderNumber);

            if (!response.orders || response.orders.length === 0) {
              return rejectWithValue('Заказ не найден');
            }

            return response.orders[0];
          } catch (err) {
            return rejectWithValue('Ошибка получения заказа');
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isOrderLoading = false;
            state.currentOrder = action.payload;
            state.orderNumber = action.payload.number;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
          }
        }
      )
    })
  });

export const orderSlice = makeOrderSlice();

export const { createOrder, fetchOrderByNumber, closeOrderModal } =
  orderSlice.actions;

export const { selectCurrentOrder, selectIsOrderLoading } =
  orderSlice.selectors;
