import type { UnknownAction } from '@reduxjs/toolkit';
import {
  fetchFeedOrders,
  clearFeed,
  feedSlice,
  initialState
} from './feed-slice';
import { TOrder, TOrdersData } from '@utils-types';

const reduce = feedSlice.reducer;
const actionStub: UnknownAction = { type: 'unknown' };

const generateOrder = (
  overrides: Partial<TOrder> = {},
  seedNum = 0
): TOrder => ({
  _id: `order-id-${seedNum}`,
  number: seedNum,
  name: `order-name-${seedNum}`,
  status: 'done',
  createdAt: `2026-01-01T00:00:0${seedNum}.000Z`,
  updatedAt: `2026-01-01T00:00:0${seedNum}.000Z`,
  ingredients: [`ingredient-id-${seedNum}`],
  ...overrides
});

const generateOrdersData = (
  overrides: Partial<TOrdersData> = {},
  seedNum = 0
): TOrdersData => ({
  orders: [generateOrder({}, seedNum)],
  total: seedNum + 10,
  totalToday: seedNum + 5,
  ...overrides
});

describe('feedSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  describe(fetchFeedOrders.typePrefix, () => {
    it('sets loading and clears the error on pending', () => {
      const state = reduce(
        {
          ...initialState,
          error: 'Ошибка'
        },
        {
          type: fetchFeedOrders.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: undefined
      });
    });

    it('stores orders and totals on fulfilled', () => {
      const payload = generateOrdersData({}, 1);

      const state = reduce(initialState, {
        type: fetchFeedOrders.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        orders: payload.orders,
        total: payload.total,
        totalToday: payload.totalToday
      });
    });

    it('stores the error and disables loading on rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';

      const state = reduce(initialState, {
        type: fetchFeedOrders.rejected.type,
        payload: errorMessage
      });

      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: fetchFeedOrders.rejected.type
      });

      expect(state).toEqual({
        ...initialState,
        error: 'Неизвестная ошибка'
      });
    });
  });

  it('resets the feed state to the initial state', () => {
    const modifiedState = {
      ...generateOrdersData({}, 1),
      isLoading: true,
      error: 'Ошибка'
    };

    const state = reduce(modifiedState, clearFeed());

    expect(state).toEqual(initialState);
  });
});
