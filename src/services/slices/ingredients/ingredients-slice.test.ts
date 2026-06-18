import type { UnknownAction } from '@reduxjs/toolkit';
import {
  fetchIngredients,
  ingredientsSlice,
  initialState
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

const reduce = ingredientsSlice.reducer;
const actionStub: UnknownAction = { type: 'unknown' };

const generateIngredient = (
  overrides: Partial<TIngredient> = {},
  seedNum = 0
): TIngredient => ({
  _id: `ingredient-id-${seedNum}`,
  name: `ingredient-name-${seedNum}`,
  type: 'main',
  proteins: seedNum + 10,
  fat: seedNum + 10,
  carbohydrates: seedNum + 10,
  calories: seedNum * 100,
  price: seedNum * 200,
  image: `ingredient-image-${seedNum}`,
  image_large: `ingredient-image-large-${seedNum}`,
  image_mobile: `ingredient-image-mobile-${seedNum}`,
  ...overrides
});

describe('ingredientsSlice', () => {
  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('sets loading and clears the error on pending', () => {
      const state = reduce(
        {
          ...initialState,
          error: 'Ошибка'
        },
        {
          type: fetchIngredients.pending.type
        }
      );

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('stores ingredients on fulfilled', () => {
      const payload = [
        generateIngredient({ type: 'bun' }, 1),
        generateIngredient({ type: 'main' }, 2)
      ];

      const state = reduce(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload
      });

      expect(state).toEqual({
        ...initialState,
        ingredients: payload
      });
    });

    it('stores the error and disables loading on rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';

      const state = reduce(initialState, {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      });

      expect(state).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('uses the default error when rejected has no payload', () => {
      const state = reduce(initialState, {
        type: fetchIngredients.rejected.type
      });

      expect(state).toEqual({
        ...initialState,
        error: 'Неизвестная ошибка'
      });
    });
  });
});
