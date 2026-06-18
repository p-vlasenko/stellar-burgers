import type { UnknownAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  fetchUser,
  authChecked,
  updateUser,
  forgotPassword,
  resetPassword,
  authSlice,
  initialState,
  TState
} from './auth-slice';
import { TUser } from '@utils-types';

const reduce = authSlice.reducer;
const actionStub: UnknownAction = { type: 'unknown' };

describe('authSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  it('marks auth as checked and clears loading state', () => {
    const state = reduce(
      {
        ...initialState,
        isLoading: true,
        error: 'some error'
      },
      authChecked()
    );

    expect(state).toEqual({
      ...initialState,
      isAuthChecked: true,
      isLoading: false,
      error: undefined
    });
  });

  const asyncActions = [
    {
      action: register,
      fallbackError: 'Ошибка регистрации'
    },
    {
      action: login,
      fallbackError: 'Ошибка логина'
    },
    {
      action: fetchUser,
      fallbackError: 'Ошибка получения пользователя',
      rejectedState: {
        isAuthChecked: true,
        user: undefined
      }
    },
    {
      action: updateUser,
      fallbackError: 'Ошибка обновления пользователя'
    },
    {
      action: logout,
      fallbackError: 'Ошибка выхода'
    },
    {
      action: forgotPassword,
      fallbackError: 'Ошибка восстановления пароля'
    },
    {
      action: resetPassword,
      fallbackError: 'Ошибка сброса пароля'
    }
  ];

  for (const { action, fallbackError, rejectedState } of asyncActions) {
    describe(action.typePrefix, () => {
      it('clears the error and enables loading on pending', () => {
        const state = reduce(
          {
            ...initialState,
            error: 'some error'
          },
          { type: action.pending.type }
        );

        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: undefined
        });
      });

      it('disables loading and stores the error on rejected', () => {
        const errorMessage = 'some error';

        const state = reduce(initialState, {
          payload: errorMessage,
          type: action.rejected.type
        });

        expect(state).toEqual({
          ...initialState,
          ...rejectedState,
          error: errorMessage
        });
      });

      it('uses the fallback error when rejected has no payload', () => {
        const state = reduce(initialState, {
          type: action.rejected.type
        });

        expect(state).toEqual({
          ...initialState,
          ...rejectedState,
          error: fallbackError
        });
      });
    });
  }

  describe('register', () => {
    it('stores the user and tokens on fulfilled', () => {
      const payload = {
        user: generateUser(),
        ...generateAuthTokens()
      };

      const state = reduce(initialState, {
        type: register.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        isAuthChecked: true
      });
    });
  });

  describe('login', () => {
    it('stores the user and tokens on fulfilled', () => {
      const payload = {
        user: generateUser(),
        ...generateAuthTokens()
      };

      const state = reduce(initialState, {
        type: login.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        isAuthChecked: true
      });
    });
  });

  describe('fetchUser', () => {
    it('stores the user and marks auth as checked on fulfilled', () => {
      const user = generateUser();

      const state = reduce(initialState, {
        type: fetchUser.fulfilled.type,
        payload: user
      });

      expect(state).toEqual({
        ...initialState,
        user,
        isAuthChecked: true,
        error: undefined
      });
    });
  });

  describe('updateUser', () => {
    it('stores the updated user on fulfilled', () => {
      const user = generateUser();

      const state = reduce(initialState, {
        type: updateUser.fulfilled.type,
        payload: user
      });

      expect(state).toEqual({
        ...initialState,
        user
      });
    });
  });

  describe('logout', () => {
    it('clears user and tokens on fulfilled', () => {
      const stateWithUser: TState = {
        ...initialState,
        user: generateUser(),
        ...generateAuthTokens()
      };

      const state = reduce(stateWithUser, {
        type: logout.fulfilled.type
      });

      expect(state).toEqual({
        ...initialState,
        user: undefined,
        accessToken: undefined,
        refreshToken: undefined
      });
    });
  });

  describe('forgotPassword', () => {
    it('disables loading and clears the error on fulfilled', () => {
      const state = reduce(
        {
          ...initialState,
          isLoading: true,
          error: 'some error'
        },
        {
          type: forgotPassword.fulfilled.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: undefined
      });
    });
  });

  describe('resetPassword', () => {
    it('disables loading and clears the error on fulfilled', () => {
      const state = reduce(
        {
          ...initialState,
          isLoading: true,
          error: 'some error'
        },
        {
          type: resetPassword.fulfilled.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: undefined
      });
    });
  });
});

const generateUser = (overrides: Partial<TUser> = {}, seedNum = 0): TUser => ({
  name: `user-name-${seedNum}`,
  email: `user-name-${seedNum}@test-mail.com`,
  ...overrides
});

const generateAuthTokens = (seedNum = 0) => ({
  accessToken: `access-token-${seedNum}`,
  refreshToken: `refresh-token-${seedNum}`
});
