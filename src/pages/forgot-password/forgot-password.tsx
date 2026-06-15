import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch } from '@store';
import { forgotPassword, selectAuthError } from '@slices/auth/auth-slice';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const error = useSelector(selectAuthError);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email })).then(() => {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
