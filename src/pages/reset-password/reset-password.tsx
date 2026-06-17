import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { resetPassword, selectAuthError } from '@slices/auth/auth-slice';
import { useDispatch, useSelector } from '@store';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetPassword({ password, token })).then((result) => {
      if (resetPassword.fulfilled.match(result)) {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
