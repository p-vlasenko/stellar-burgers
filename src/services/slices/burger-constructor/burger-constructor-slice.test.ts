import type { TIngredient } from '@utils-types';

import {
  makeBurgerConstructorSlice,
  initialState
} from './burger-constructor-slice';
import { UnknownAction } from '@reduxjs/toolkit';

const burgerConstructorSlice = makeBurgerConstructorSlice(initialState, {
  generateId: () => 'test-id'
});

const reduce = burgerConstructorSlice.reducer;

const {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor
} = burgerConstructorSlice.actions;

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

describe('burgerConstructor slice', () => {
  const bunIngredient = generateIngredient({ type: 'bun' }, 1);
  const mainIngredient = generateIngredient({ type: 'main' }, 2);

  it('returns the initial state for an unknown action', () => {
    expect(reduce(undefined, actionStub)).toEqual(initialState);
  });

  it('stores a bun ingredient as the selected bun', () => {
    const action = addToConstructor(bunIngredient);

    const state = reduce(initialState, action);

    expect(state.bun).toEqual({ ...bunIngredient, id: 'test-id' });
    expect(state.ingredients).toHaveLength(0);
  });

  it('adds a non-bun ingredient to the ingredients list', () => {
    const action = addToConstructor(mainIngredient);

    const state = reduce(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...mainIngredient, id: 'test-id' });
    expect(state.bun).toBeUndefined();
  });

  it('removes an ingredient by index', () => {
    const stateWithIngredient = reduce(
      initialState,
      addToConstructor(mainIngredient)
    );

    const stateAfterRemove = reduce(
      stateWithIngredient,
      removeFromConstructor(0)
    );

    expect(stateAfterRemove.ingredients).toHaveLength(0);
  });

  it('moves an ingredient from one position to another', () => {
    const ingredient1 = generateIngredient({ _id: 'main1' }, 1);
    const ingredient2 = generateIngredient({ _id: 'main2' }, 2);

    let state = reduce(initialState, addToConstructor(ingredient1));
    state = reduce(state, addToConstructor(ingredient2));

    expect(state.ingredients[0]._id).toBe('main1');
    expect(state.ingredients[1]._id).toBe('main2');

    const stateAfterReorder = reduce(
      state,
      reorderConstructor({ from: 0, to: 1 })
    );

    expect(stateAfterReorder.ingredients[0]._id).toBe('main2');
    expect(stateAfterReorder.ingredients[1]._id).toBe('main1');
  });

  it('resets the constructor to the initial state', () => {
    const actionChain = [
      addToConstructor(bunIngredient),
      addToConstructor(mainIngredient),
      resetConstructor()
    ];

    const state = actionChain.reduce(reduce, initialState);

    expect(state).toEqual(initialState);
  });
});
