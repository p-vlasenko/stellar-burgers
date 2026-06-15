import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun?: TConstructorIngredient;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  ingredients: []
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const CONSTRUCTOR_SLICE_NAME = 'burgerConstructor';

export const makeBurgerConstructorSlice = (state = initialState) =>
  createSliceWithThunks({
    name: CONSTRUCTOR_SLICE_NAME,
    initialState: state,
    selectors: {
      constructorSelector: (state) => state
    },
    reducers: (create) => ({
      addToConstructor: create.preparedReducer(
        (ingredient: TIngredient) => ({
          payload: { ...ingredient, id: nanoid() }
        }),
        (state, { payload }: PayloadAction<TConstructorIngredient>) => {
          if (payload.type === 'bun') {
            state.bun = payload;
          } else {
            state.ingredients.push(payload);
          }
        }
      ),

      removeFromConstructor: create.reducer(
        (state, { payload }: PayloadAction<number>) => {
          state.ingredients.splice(payload, 1);
        }
      ),

      reorderConstructor: create.reducer(
        (state, { payload }: PayloadAction<{ from: number; to: number }>) => {
          const { from, to } = payload;
          const [moved] = state.ingredients.splice(from, 1);
          state.ingredients.splice(to, 0, moved);
        }
      ),

      resetConstructor: create.reducer(() => initialState)
    })
  });

export const burgerConstructorSlice = makeBurgerConstructorSlice();

export const { constructorSelector } = burgerConstructorSlice.selectors;

export const {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor
} = burgerConstructorSlice.actions;
