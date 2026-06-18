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
  initialState
} from './auth-slice';
import { TUser } from '@utils-types';

const reduce = authSlice.reducer;

describe('authSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, { type: '' })).toEqual(initialState);
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

    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeUndefined();
  });

  const asyncActions = [
    register,
    login,
    fetchUser,
    updateUser,
    logout,
    forgotPassword,
    resetPassword
  ];

  for (const action of asyncActions) {
    describe(action.typePrefix, () => {
      it('clears the error and enables loading on pending', () => {
        const state = reduce(initialState, { type: action.pending.type });

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeUndefined();
      });

      it('disables loading and stores the error on rejected', () => {
        const payload = 'some error';

        const state = reduce(initialState, {
          payload,
          type: action.rejected.type
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(payload);
      });
    });
  }

  it('stores the user and tokens after a successful registration', () => {
    const payload = {
      user: generateUser(),
      ...generateAuthTokens()
    };

    const state = reduce(initialState, {
      type: register.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe(payload.accessToken);
    expect(state.refreshToken).toBe(payload.refreshToken);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('stores the user and tokens after a successful login', () => {
    const payload = {
      user: generateUser(),
      ...generateAuthTokens()
    };

    const state = reduce(initialState, {
      type: login.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe(payload.accessToken);
    expect(state.refreshToken).toBe(payload.refreshToken);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('stores the user and marks auth as checked after successfully loading the profile', () => {
    const user = generateUser();

    const state = reduce(initialState, {
      type: fetchUser.fulfilled.type,
      payload: user
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
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
