import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@store';
import { selectUser, updateUser } from '@slices/auth/auth-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) {
      return;
    }

    const payload: Partial<{ name: string; email: string; password?: string }> =
      {
        name: formValue.name,
        email: formValue.email
      };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    dispatch(updateUser(payload));
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
