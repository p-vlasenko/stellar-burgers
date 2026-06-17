import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { GetFeedsExtra, RejectsToStr } from '../../types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error?: string;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const FEED_SLICE_NAME = 'feed';

const setPendingState = (state: TFeedState) => {
  state.isLoading = true;
  state.error = undefined;
};

const setRejectedState = (state: TFeedState, payload: unknown) => {
  state.isLoading = false;
  state.error = typeof payload === 'string' ? payload : 'Неизвестная ошибка';
};

export const makeFeedSlice = (state = initialState) =>
  createSliceWithThunks({
    name: FEED_SLICE_NAME,
    initialState: state,
    selectors: {
      selectFeedOrders: (state) => state.orders,
      selectFeedTotal: (state) => state.total,
      selectFeedTotalToday: (state) => state.totalToday,
      selectFeedIsLoading: (state) => state.isLoading
    },
    reducers: (create) => ({
      clearFeed: create.reducer((state) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = false;
        state.error = undefined;
      }),

      fetchFeedOrders: create.asyncThunk<
        void,
        TOrdersData,
        RejectsToStr & GetFeedsExtra
      >(
        async (_, { rejectWithValue, extra: { getFeeds } }) => {
          try {
            return await getFeeds();
          } catch (err) {
            return rejectWithValue('Ошибка загрузки ленты заказов');
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.orders = action.payload.orders;
            state.total = action.payload.total;
            state.totalToday = action.payload.totalToday;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
          }
        }
      )
    })
  });

export const feedSlice = makeFeedSlice();

export const { fetchFeedOrders, clearFeed } = feedSlice.actions;

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsLoading
} = feedSlice.selectors;
