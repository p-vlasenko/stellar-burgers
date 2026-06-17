import {
  ForgotPassword,
  GetFeeds,
  GetIngredients,
  GetOrderByNumber,
  GetOrders,
  GetUser,
  Login,
  Logout,
  OrderBurger,
  RegisterUser,
  ResetPassword,
  UpdateUser
} from '@utils-types';

export type RejectsToStr = { rejectValue: string };
export type Extra<T> = { extra: T };

export type UpdateUserExtra = Extra<{ updateUser: UpdateUser }>;
export type RegisterUserExtra = Extra<{ registerUser: RegisterUser }>;
export type GetUserExtra = Extra<{ getUser: GetUser }>;
export type LoginUserExtra = Extra<{ login: Login }>;
export type LogoutExtra = Extra<{ logout: Logout }>;
export type ForgotPasswordExtra = Extra<{ forgotPassword: ForgotPassword }>;
export type ResetPasswordExtra = Extra<{ resetPassword: ResetPassword }>;
export type GetOrdersExtra = Extra<{ getOrders: GetOrders }>;
export type OrderBurgerExtra = Extra<{ orderBurger: OrderBurger }>;
export type GetIngredientsExtra = Extra<{ getIngredients: GetIngredients }>;
export type GetFeedsExtra = Extra<{ getFeeds: GetFeeds }>;
export type GetOrderByNumberExtra = Extra<{
  getOrderByNumber: GetOrderByNumber;
}>;
