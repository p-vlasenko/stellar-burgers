import { UnknownAction } from '@reduxjs/toolkit';

import store from './store';
import { burgerConstructorSlice } from './slices/burger-constructor/burger-constructor-slice';
import { ingredientsSlice } from './slices/ingredients/ingredients-slice';
import { orderSlice } from './slices/order-slice/order-slice';
import { feedSlice } from './slices/feed/feed-slice';
import { profileOrdersSlice } from './slices/profile-orders/profile-orders-slice';
import { authSlice } from './slices/auth/auth-slice';

const reduceConstructorState = burgerConstructorSlice.reducer;
const reduceIngredientsState = ingredientsSlice.reducer;
const reduceAuthState = authSlice.reducer;
const reduceOrderState = orderSlice.reducer;
const reduceFeedState = feedSlice.reducer;
const reduceProfileOrdersState = profileOrdersSlice.reducer;

const actionStub: UnknownAction = { type: 'unknown' };

describe('rootReducer', () => {
  it('returns the initial state for every slice', () => {
    const state = store.getState();

    expect(state.burgerConstructor).toEqual(
      reduceConstructorState(undefined, actionStub)
    );

    expect(state.ingredients).toEqual(
      reduceIngredientsState(undefined, actionStub)
    );

    expect(state.order).toEqual(reduceOrderState(undefined, actionStub));

    expect(state.feed).toEqual(reduceFeedState(undefined, actionStub));

    expect(state.profileOrders).toEqual(
      reduceProfileOrdersState(undefined, actionStub)
    );

    expect(state.auth).toEqual(reduceAuthState(undefined, actionStub));
  });
});
