import { FC, memo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  constructorSelector,
  removeFromConstructor,
  reorderConstructor
} from '@slices/burger-constructor/burger-constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const constructorItems = useSelector(constructorSelector);

    const handleClose = () => {
      dispatch(removeFromConstructor(index));
    };

    const handleMoveDown = () => {
      if (index < constructorItems.ingredients.length - 1) {
        dispatch(reorderConstructor({ from: index, to: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(reorderConstructor({ from: index, to: index - 1 }));
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
