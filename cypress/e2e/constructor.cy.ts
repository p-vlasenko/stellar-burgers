describe('burger constructor page', () => {
  beforeEach(() => {
    cy.setUpConstructorInterceptors();
    cy.authorizeByFixture();
    cy.visitConstructorPage();
  });

  afterEach(() => {
    cy.resetAuthTokens();
  });

  it('shows added bun and filling in the constructor', () => {
    cy.addBunToConstructor();
    cy.constructorShouldContainBuns();

    cy.addMainIngredientToConstructor();
    cy.constructorShouldContainIngredients(1);
  });

  it('shows ingredient details and closes the modal in different ways', () => {
    cy.openFirstMainIngredientModal();
    cy.ingredientModalShouldContainSelectedIngredient();

    cy.closeModalByButton();
    cy.ingredientModalShouldBeClosed();

    cy.openFirstMainIngredientModal();
    cy.closeModalByOverlay();
    cy.ingredientModalShouldBeClosed();
  });

  it('creates an order and clears the constructor after closing the modal', () => {
    const orderNumberFromFixture = 100500;

    cy.addBunToConstructor();
    cy.addMainIngredientToConstructor();
    cy.submitOrder();
    cy.orderModalShouldBeOpenFor(orderNumberFromFixture);

    cy.closeModalByButton();
    cy.orderModalShouldBeClosed();
    cy.constructorShouldBeEmpty();
  });
});
