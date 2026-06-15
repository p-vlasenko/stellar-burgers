import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData?: TOrder;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
