import { forwardRef, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { constructorSelector } from '@slices/burger-constructor/burger-constructor-slice';
import { useSelector } from '@store';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorItems = useSelector(constructorSelector);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = constructorItems;
    const counters: Record<string, number> = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }

      counters[ingredient._id]++;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
