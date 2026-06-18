import type { UnknownAction } from '@reduxjs/toolkit';
import {
  fetchProfileOrders,
  fetchProfileOrderByNumber,
  profileOrdersSlice,
  initialState
} from './profile-orders-slice';
import { TOrder } from '@utils-types';

const reduce = profileOrdersSlice.reducer;
const actionStub: UnknownAction = { type: '' };

const generateOrder = (
  overrides: Partial<TOrder> = {},
  seedNum = 0
): TOrder => ({
  _id: `order-id-${seedNum}`,
  status: 'done',
  name: `order-name-${seedNum}`,
  createdAt: `2026-01-01T00:00:0${seedNum}.000Z`,
  updatedAt: `2026-01-01T00:00:0${seedNum}.000Z`,
  number: seedNum,
  ingredients: [`ingredient-id-${seedNum}`],
  ...overrides
});

describe('profileOrdersSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  describe('fetchProfileOrders', () => {
    it('sets loading and clears the error on pending', () => {
      const state = reduce(
        {
          ...initialState,
          error: 'Ошибка'
        },
        {
          type: fetchProfileOrders.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: undefined
      });
    });

    it('stores profile orders on fulfilled', () => {
      const orders = [generateOrder()];

      const state = reduce(initialState, {
        type: fetchProfileOrders.fulfilled.type,
        payload: orders
      });

      expect(state).toEqual({
        ...initialState,
        orders
      });
    });

    it('stores the error and disables loading on rejected', () => {
      const errorMessage = 'Ошибка загрузки истории заказов';

      const state = reduce(initialState, {
        type: fetchProfileOrders.rejected.type,
        payload: errorMessage
      });

      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: fetchProfileOrders.rejected.type
      });

      expect(state).toEqual({
        ...initialState,
        error: 'Неизвестная ошибка'
      });
    });
  });

  describe('fetchProfileOrderByNumber', () => {
    it('sets loading, clears the error and resets current order on pending', () => {
      const state = reduce(
        {
          ...initialState,
          currentOrder: generateOrder({}, 1),
          error: 'Ошибка'
        },
        {
          type: fetchProfileOrderByNumber.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        currentOrder: undefined,
        error: undefined
      });
    });

    it('stores the current profile order on fulfilled', () => {
      const payload = generateOrder();

      const state = reduce(initialState, {
        type: fetchProfileOrderByNumber.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        currentOrder: payload
      });
    });

    it('stores the error, disables loading and resets current order on rejected', () => {
      const errorMessage = 'Ошибка загрузки заказа';

      const state = reduce(
        {
          ...initialState,
          currentOrder: generateOrder({}, 1)
        },
        {
          type: fetchProfileOrderByNumber.rejected.type,
          payload: errorMessage
        }
      );

      expect(state).toEqual({
        ...initialState,
        currentOrder: undefined,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: fetchProfileOrderByNumber.rejected.type,
      });

      expect(state).toEqual({
        ...initialState,
        currentOrder: undefined,
        error: 'Неизвестная ошибка'
      });
    });
  });
});
