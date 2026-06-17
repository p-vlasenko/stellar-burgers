import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { useDispatch } from '@store';
import { useNavigate, useLocation } from 'react-router-dom';
import { register, selectAuthError } from '@slices/auth/auth-slice';
import { useSelector } from '@store';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectAuthError);

  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname ?? '/';

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const action = register({
      email,
      password,
      name: userName
    });

    dispatch(action).then(() => {
      navigate(from, { replace: true });
    });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
