import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { TUser, TLoginData, TRegisterData } from '@utils-types';
import {
  ForgotPasswordExtra,
  GetUserExtra,
  LoginUserExtra,
  LogoutExtra,
  RejectsToStr,
  ResetPasswordExtra,
  UpdateUserExtra
} from '../../types';
import { TAuthResponse } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

export type TState = {
  user?: TUser;
  accessToken?: string;
  refreshToken?: string;
  isAuthChecked: boolean;
  isLoading: boolean;
  error?: string;
};

const getInitialState = (): TState => ({
  accessToken: getCookie('accessToken'),
  refreshToken: localStorage.getItem('refreshToken') || undefined,
  isAuthChecked: false,
  isLoading: false
});

export const initialState = getInitialState();

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const AUTH_SLICE_NAME = 'auth';

const getErrorMessage = (err: unknown, fallback: string) => {
  const { message } = err as Error;

  return message || fallback;
};

const setPendingState = (state: TState) => {
  state.isLoading = true;
  state.error = undefined;
};

const setRejectedState = (
  state: TState,
  payload: unknown,
  fallback: string
) => {
  state.isLoading = false;
  state.error = typeof payload === 'string' ? payload : fallback;
};

export const makeAuthSlice = (state = getInitialState()) =>
  createSliceWithThunks({
    name: AUTH_SLICE_NAME,
    initialState: state,
    selectors: {
      selectUser: (state) => state.user,
      selectAuthError: (state) => state.error,
      selectAccessToken: (state) => state.accessToken,
      selectIsAuthChecked: (state) => state.isAuthChecked
    },
    reducers: (create) => ({
      register: create.asyncThunk<
        TRegisterData,
        TAuthResponse,
        {
          extra: {
            registerUser: (data: TRegisterData) => Promise<TAuthResponse>;
          };
          rejectValue: string;
        }
      >(
        async (data, { extra: { registerUser }, rejectWithValue }) => {
          try {
            const res = await registerUser(data);
            localStorage.setItem('refreshToken', res.refreshToken);
            setCookie('accessToken', res.accessToken);

            return res;
          } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err, 'Ошибка регистрации'));
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthChecked = true;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload, 'Ошибка регистрации');
          }
        }
      ),

      login: create.asyncThunk<
        TLoginData,
        TAuthResponse,
        RejectsToStr & LoginUserExtra
      >(
        async (data, { rejectWithValue, extra: { login } }) => {
          try {
            const res = await login(data);
            localStorage.setItem('refreshToken', res.refreshToken);
            setCookie('accessToken', res.accessToken);

            return res;
          } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err, 'Ошибка логина'));
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthChecked = true;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload, 'Ошибка логина');
          }
        }
      ),

      fetchUser: create.asyncThunk<void, TUser, RejectsToStr & GetUserExtra>(
        async (_, { rejectWithValue, extra: { getUser } }) => {
          try {
            const res = await getUser();

            return res.user;
          } catch (err: unknown) {
            return rejectWithValue(
              getErrorMessage(err, 'Ошибка получения пользователя')
            );
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthChecked = true;
            state.error = undefined;
          },
          rejected: (state, action) => {
            state.user = undefined;
            state.isAuthChecked = true;
            setRejectedState(
              state,
              action.payload,
              'Ошибка получения пользователя'
            );
          }
        }
      ),

      updateUser: create.asyncThunk<
        Partial<TRegisterData>,
        TUser,
        RejectsToStr & UpdateUserExtra
      >(
        async (data, { rejectWithValue, extra: { updateUser } }) => {
          try {
            const res = await updateUser(data);

            return res.user;
          } catch (err: unknown) {
            return rejectWithValue(
              getErrorMessage(err, 'Ошибка обновления пользователя')
            );
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
          },
          rejected: (state, action) => {
            setRejectedState(
              state,
              action.payload,
              'Ошибка обновления пользователя'
            );
          }
        }
      ),

      logout: create.asyncThunk<void, void, RejectsToStr & LogoutExtra>(
        async (_, { rejectWithValue, extra: { logout } }) => {
          try {
            await logout();
            localStorage.removeItem('refreshToken');
            deleteCookie('accessToken');
          } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err, 'Ошибка выхода'));
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state) => {
            state.isLoading = false;
            state.user = undefined;
            state.accessToken = undefined;
            state.refreshToken = undefined;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload, 'Ошибка выхода');
          }
        }
      ),

      forgotPassword: create.asyncThunk<
        { email: string },
        { success: boolean },
        RejectsToStr & ForgotPasswordExtra
      >(
        async (data, { rejectWithValue, extra: { forgotPassword } }) => {
          try {
            return await forgotPassword(data);
          } catch (err: unknown) {
            return rejectWithValue(
              getErrorMessage(err, 'Ошибка восстановления пароля')
            );
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state) => {
            state.isLoading = false;
            state.error = undefined;
          },
          rejected: (state, action) => {
            setRejectedState(
              state,
              action.payload,
              'Ошибка восстановления пароля'
            );
          }
        }
      ),

      resetPassword: create.asyncThunk<
        { password: string; token: string },
        { success: boolean },
        RejectsToStr & ResetPasswordExtra
      >(
        async (data, { rejectWithValue, extra: { resetPassword } }) => {
          try {
            return await resetPassword(data);
          } catch (err: unknown) {
            return rejectWithValue(
              getErrorMessage(err, 'Ошибка сброса пароля')
            );
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state) => {
            state.isLoading = false;
            state.error = undefined;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload, 'Ошибка сброса пароля');
          }
        }
      )
    })
  });

export const authSlice = makeAuthSlice();

export const {
  register,
  login,
  logout,
  fetchUser,
  updateUser,
  forgotPassword,
  resetPassword
} = authSlice.actions;

export const {
  selectUser,
  selectAccessToken,
  selectIsAuthChecked,
  selectAuthError
} = authSlice.selectors;
