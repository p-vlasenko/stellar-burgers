import type { UnknownAction } from '@reduxjs/toolkit';
import {
  createOrder,
  fetchOrderByNumber,
  closeOrderModal,
  orderSlice,
  initialState,
  TOrderState
} from './order-slice';
import { TOrder } from '@utils-types';

const reduce = orderSlice.reducer;
const actionStub: UnknownAction = { type: 'unknown' };

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

describe('orderSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('sets loading and clears the error on pending', () => {
      const state = reduce(
        {
          ...initialState,
          error: 'Ошибка'
        },
        {
          type: createOrder.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isOrderLoading: true,
        error: undefined
      });
    });

    it('stores the created order on fulfilled', () => {
      const payload = generateOrder({}, 123);

      const state = reduce(initialState, {
        type: createOrder.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        currentOrder: payload,
        orderNumber: payload.number
      });
    });

    it('stores the error and disables loading on rejected', () => {
      const errorMessage = 'Ошибка создания заказа';

      const state = reduce(initialState, {
        type: createOrder.rejected.type,
        payload: errorMessage
      });

      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: createOrder.rejected.type
      });

      expect(state).toEqual({
        ...initialState,
        error: 'Неизвестная ошибка'
      });
    });
  });

  describe('fetchOrderByNumber', () => {
    it('sets loading and clears the error on pending', () => {
      const state = reduce(
        {
          ...initialState,
          error: 'Ошибка'
        },
        {
          type: fetchOrderByNumber.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isOrderLoading: true,
        error: undefined
      });
    });

    it('stores the fetched order on fulfilled', () => {
      const payload = generateOrder({ status: 'pending' }, 124);

      const state = reduce(initialState, {
        type: fetchOrderByNumber.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        currentOrder: payload,
        orderNumber: payload.number
      });
    });

    it('stores the error and disables loading on rejected', () => {
      const errorMessage = 'Ошибка получения заказа';

      const state = reduce(initialState, {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      });

      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: fetchOrderByNumber.rejected.type
      });

      expect(state).toEqual({
        ...initialState,
        error: 'Неизвестная ошибка'
      });
    });
  });

  it('resets the order state to the initial state', () => {
    const preState: TOrderState = {
      currentOrder: generateOrder({}, 1),
      orderNumber: 1,
      isOrderLoading: true,
      error: 'Ошибка'
    };

    const state = reduce(preState, closeOrderModal());

    expect(state).toEqual(initialState);
  });
});
