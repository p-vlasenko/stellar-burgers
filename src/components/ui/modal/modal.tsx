import React, { FC, memo, ReactElement } from 'react';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { ModalOverlayUI } from '@ui';

import { TModalUIProps } from './type';

import styles from './modal.module.css';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => {
    const getModalType = (): 'order-modal' | 'ingredient-modal' => {
      const childrenArray = React.Children.toArray(children).filter(
        React.isValidElement
      ) as ReactElement[];

      const hasOrderDetails = childrenArray.some((child) => {
        if ('orderNumber' in child.props && child.props.orderNumber) {
          return true;
        }

        const componentType = child.type as FC & {
          displayName?: string;
          name?: string;
        };

        return (
          componentType.displayName === 'OrderDetailsUI' ||
          componentType.name === 'OrderDetailsUI'
        );
      });

      return hasOrderDetails ? 'order-modal' : 'ingredient-modal';
    };

    return (
      <>
        <div className={styles.modal} data-cy={getModalType()}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text text_type_main-large`}>
              {title}
            </h3>
            <button
              className={styles.button}
              type='button'
              data-cy='modal-close'
            >
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
