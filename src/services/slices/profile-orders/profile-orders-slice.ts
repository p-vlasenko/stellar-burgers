import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../../store';
import {
  GetOrderByNumberExtra,
  GetOrdersExtra,
  RejectsToStr
} from '../../types';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error?: string;
  currentOrder?: TOrder;
};

export const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const PROFILE_ORDERS_SLICE_NAME = 'profileOrders';

const setPendingState = (state: ProfileOrdersState) => {
  state.isLoading = true;
  state.error = undefined;
};

const setRejectedState = (state: ProfileOrdersState, payload: unknown) => {
  state.isLoading = false;
  state.error = typeof payload === 'string' ? payload : 'Неизвестная ошибка';
};

export const makeProfileOrdersSlice = (state = initialState) =>
  createSliceWithThunks({
    name: PROFILE_ORDERS_SLICE_NAME,
    initialState: state,
    selectors: {
      selectProfileOrders: (state) => state.orders,
      selectProfileOrdersLoading: (state) => state.isLoading
    },
    reducers: (create) => ({
      fetchProfileOrders: create.asyncThunk<
        void,
        TOrder[],
        RejectsToStr & GetOrdersExtra
      >(
        async (_, { rejectWithValue, extra: { getOrders } }) => {
          try {
            return await getOrders();
          } catch (error) {
            return rejectWithValue('Ошибка загрузки истории заказов');
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
            state.error = undefined;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
          }
        }
      ),

      fetchProfileOrderByNumber: create.asyncThunk<
        number,
        TOrder,
        RejectsToStr & GetOrderByNumberExtra
      >(
        async (number, { rejectWithValue, extra: { getOrderByNumber } }) => {
          try {
            const response = await getOrderByNumber(number);

            if (!response.orders || response.orders.length === 0) {
              return rejectWithValue('Заказ не найден');
            }

            return response.orders[0];
          } catch (error) {
            return rejectWithValue('Ошибка загрузки заказа');
          }
        },
        {
          pending: (state) => {
            setPendingState(state);
            state.currentOrder = undefined;
          },
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.currentOrder = action.payload;
            state.error = undefined;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
            state.currentOrder = undefined;
          }
        }
      )
    })
  });

export const profileOrdersSlice = makeProfileOrdersSlice();

export const { fetchProfileOrders, fetchProfileOrderByNumber } =
  profileOrdersSlice.actions;

export const { selectProfileOrders, selectProfileOrdersLoading } =
  profileOrdersSlice.selectors;

const findOrderByItemNumber = (orders: TOrder[], itemNum: number) =>
  orders.find((item) => item.number === itemNum);

type InfoSelector = (
  itemNum?: number
) => (store: RootState) => TOrder | undefined;

export const ordersInfoDataSelector: InfoSelector =
  (itemNum) =>
  ({ profileOrders, feed }) => {
    if (itemNum === undefined) {
      return undefined;
    }

    const { currentOrder } = profileOrders;

    if (currentOrder?.number === itemNum) {
      return currentOrder;
    }

    return (
      findOrderByItemNumber(profileOrders.orders, itemNum) ??
      findOrderByItemNumber(feed.orders, itemNum)
    );
  };
