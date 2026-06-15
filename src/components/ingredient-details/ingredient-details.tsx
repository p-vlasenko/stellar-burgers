import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { selectIngredientById } from '@slices/ingredients/ingredients-slice';
import { useSelector } from '@store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id)
  );

  return !ingredientData ? (
    <Preloader />
  ) : (
    <IngredientDetailsUI ingredientData={ingredientData} />
  );
};
