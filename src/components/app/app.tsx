import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

import { router } from '../../app/router';
import { useDispatch } from '@store';
import { fetchIngredients } from '@slices/ingredients/ingredients-slice';
import { fetchUser } from '@slices/auth/auth-slice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
