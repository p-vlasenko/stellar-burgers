import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './slices/ingredients/ingredients-slice';
import { burgerConstructorSlice } from './slices/burger-constructor/burger-constructor-slice';
import { orderSlice } from './slices/order-slice/order-slice';
import { feedSlice } from './slices/feed/feed-slice';
import { profileOrdersSlice } from './slices/profile-orders/profile-orders-slice';
import { authSlice } from './slices/auth/auth-slice';
import {
  forgotPassword,
  getFeeds,
  getIngredients,
  getOrders,
  getOrderByNumber,
  getUser,
  login,
  logout,
  orderBurger,
  registerUser,
  resetPassword,
  updateUser
} from '@api';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  order: orderSlice.reducer,
  feed: feedSlice.reducer,
  profileOrders: profileOrdersSlice.reducer,
  auth: authSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          registerUser,
          login,
          getUser,
          updateUser,
          logout,
          forgotPassword,
          resetPassword,
          orderBurger,
          getIngredients,
          getFeeds,
          getOrders,
          getOrderByNumber
        }
      }
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
