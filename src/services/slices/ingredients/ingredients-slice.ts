import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { GetIngredientsExtra, RejectsToStr } from '../../types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

const INGREDIENTS_SLICE_NAME = 'ingredients';

const setPendingState = (state: TIngredientsState) => {
  state.isLoading = true;
  state.error = null;
};

const setRejectedState = (state: TIngredientsState, payload: unknown) => {
  state.isLoading = false;
  state.error = typeof payload === 'string' ? payload : 'Неизвестная ошибка';
};

export const makeIngredientsSlice = (state = initialState) =>
  createSliceWithThunks({
    name: INGREDIENTS_SLICE_NAME,
    initialState: state,
    selectors: {
      selectAllIngredients: (state) => state.ingredients,
      selectIngredientById: (state, id: string | undefined) =>
        state.ingredients.find((ingredient) => ingredient._id === id),
      selectIngredientsIsLoading: (state) => state.isLoading
    },
    reducers: (create) => ({
      fetchIngredients: create.asyncThunk<
        void,
        TIngredient[],
        RejectsToStr & GetIngredientsExtra
      >(
        async (_, { rejectWithValue, extra: { getIngredients } }) => {
          try {
            return await getIngredients();
          } catch (err) {
            return rejectWithValue('Ошибка загрузки ингредиентов');
          }
        },
        {
          pending: setPendingState,
          fulfilled: (state, action) => {
            state.isLoading = false;
            state.ingredients = action.payload;
          },
          rejected: (state, action) => {
            setRejectedState(state, action.payload);
          }
        }
      )
    })
  });

export const ingredientsSlice = makeIngredientsSlice();

export const { fetchIngredients } = ingredientsSlice.actions;

export const {
  selectAllIngredients,
  selectIngredientById,
  selectIngredientsIsLoading
} = ingredientsSlice.selectors;
