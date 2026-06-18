const SELECTORS = {
  constructorBunTop: '[data-cy=constructor-bun-top]',
  constructorBunBottom: '[data-cy=constructor-bun-bottom]',
  constructorIngredient: '[data-cy=constructor-ingredient]',
  ingredientBun: '[data-cy=ingredient-bun]',
  ingredientMain: '[data-cy=ingredient-main]',
  ingredientButton: 'button',
  ingredientName: 'p:last',
  ingredientModal: '[data-cy=ingredient-modal]',
  orderButton: '[data-cy=order-button]',
  orderModal: '[data-cy=order-modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]',
  orderNumber: '[data-cy=order-number]'
} as const;

const SELECTED_INGREDIENT_NAME_ALIAS = 'selectedIngredientName';

Cypress.Commands.add('setUpConstructorInterceptors', () => {
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );

  cy.intercept('POST', '**/api/orders', (req) => {
    req.reply({ fixture: 'order.json' });
  }).as('createOrder');
});

Cypress.Commands.add('authorizeByFixture', () => {
  cy.fixture('user.json').then((user) => {
    cy.setCookie('accessToken', user.accessToken);
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', user.refreshToken);
    });
  });
});

Cypress.Commands.add('visitConstructorPage', () => {
  cy.visit('/');
  cy.wait('@getIngredients');
  cy.wait('@getUser');
});

Cypress.Commands.add('resetAuthTokens', () => {
  cy.clearCookie('accessToken');

  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
});

Cypress.Commands.add('addBunToConstructor', () => {
  cy.get(SELECTORS.ingredientBun)
    .first()
    .find(SELECTORS.ingredientButton)
    .click();
});

Cypress.Commands.add('addMainIngredientToConstructor', () => {
  cy.get(SELECTORS.ingredientMain)
    .first()
    .find(SELECTORS.ingredientButton)
    .click();
});

Cypress.Commands.add('constructorShouldContainBuns', () => {
  cy.get(SELECTORS.constructorBunTop).should('exist');
  cy.get(SELECTORS.constructorBunBottom).should('exist');
});

Cypress.Commands.add('constructorShouldContainIngredients', (count) => {
  cy.get(SELECTORS.constructorIngredient).should('have.length', count);
});

Cypress.Commands.add('constructorShouldBeEmpty', () => {
  cy.get(SELECTORS.constructorBunTop).should('not.exist');
  cy.get(SELECTORS.constructorIngredient).should('not.exist');
  cy.get(SELECTORS.constructorBunBottom).should('not.exist');
});

Cypress.Commands.add('openFirstMainIngredientModal', () => {
  cy.get(SELECTORS.ingredientMain)
    .first()
    .find(SELECTORS.ingredientName)
    .invoke('text')
    .as(SELECTED_INGREDIENT_NAME_ALIAS);

  cy.get(SELECTORS.ingredientMain).first().click();
  cy.get(SELECTORS.ingredientModal).should('exist');
});

Cypress.Commands.add('ingredientModalShouldContainSelectedIngredient', () => {
  cy.get<string>(`@${SELECTED_INGREDIENT_NAME_ALIAS}`).then((name) => {
    cy.get(SELECTORS.ingredientModal).should('contain', name);
  });
});

Cypress.Commands.add('ingredientModalShouldBeClosed', () => {
  cy.get(SELECTORS.ingredientModal).should('not.exist');
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get(SELECTORS.modalClose).click();
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(SELECTORS.modalOverlay).click({ force: true });
});

Cypress.Commands.add('submitOrder', () => {
  cy.get(SELECTORS.orderButton).click();
  cy.wait('@createOrder');
});

Cypress.Commands.add('orderModalShouldBeOpenFor', (orderNumber) => {
  cy.get(SELECTORS.orderModal).should('exist');
  cy.get(SELECTORS.orderNumber).should('contain.text', orderNumber.toString());
});

Cypress.Commands.add('orderModalShouldBeClosed', () => {
  cy.get(SELECTORS.orderModal).should('not.exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      setUpConstructorInterceptors(): Chainable<void>;
      authorizeByFixture(): Chainable<void>;
      visitConstructorPage(): Chainable<void>;
      resetAuthTokens(): Chainable<void>;
      addBunToConstructor(): Chainable<void>;
      addMainIngredientToConstructor(): Chainable<void>;
      constructorShouldContainBuns(): Chainable<void>;
      constructorShouldContainIngredients(count: number): Chainable<void>;
      constructorShouldBeEmpty(): Chainable<void>;
      openFirstMainIngredientModal(): Chainable<void>;
      ingredientModalShouldContainSelectedIngredient(): Chainable<void>;
      ingredientModalShouldBeClosed(): Chainable<void>;
      closeModalByButton(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
      submitOrder(): Chainable<void>;
      orderModalShouldBeOpenFor(orderNumber: number): Chainable<void>;
      orderModalShouldBeClosed(): Chainable<void>;
    }
  }
}

export {};
