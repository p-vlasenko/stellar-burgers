import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

import { router } from '../../app/router';
import { useDispatch, useSelector } from '@store';
import { fetchIngredients } from '@slices/ingredients/ingredients-slice';
import {
  authChecked,
  fetchUser,
  selectAccessToken
} from '@slices/auth/auth-slice';

const App = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(accessToken ? fetchUser() : authChecked());
  }, [accessToken, dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
