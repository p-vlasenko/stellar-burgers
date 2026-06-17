export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

export type GetOrderByNumber = (number: number) => Promise<TOrderResponse>;
export type OrderBurger = (data: string[]) => Promise<TNewOrderResponse>;
export type GetOrders = () => Promise<TOrder[]>;
export type GetFeeds = () => Promise<TFeedsResponse>;
export type GetIngredients = () => Promise<TIngredient[]>;
export type RegisterUser = (data: TRegisterData) => Promise<TAuthResponse>;
export type Login = (data: TLoginData) => Promise<TAuthResponse>;
export type Logout = () => Promise<{ success: boolean }>;
export type ResetPassword = (data: {
  password: string;
  token: string;
}) => Promise<{
  success: boolean;
}>;

export type UpdateUser = (
  user: Partial<TRegisterData>
) => Promise<TUserResponse>;

export type GetUser = () => Promise<TUserResponse>;

export type ForgotPassword = (data: {
  email: string;
}) => Promise<{ success: boolean }>;

export type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export type TServerResponse<T> = {
  success: boolean;
} & T;

export type TUserResponse = TServerResponse<{ user: TUser }>;

export type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;
