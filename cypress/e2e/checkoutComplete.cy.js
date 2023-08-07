/// <reference types ="Cypress"/>

import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')
let checkoutDetails = Cypress.env('checkoutInfo')

describe("\n6. 'CHECKOUT: COMPLETE' PAGE TEST\n", () => {
  it(`Test 1/1 - \'CHECKOUT: COMPLETE\' page test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
    cy.myLoginSwagStore(loginy.username, loginy.password) //loguj
    cy.visit('/inventory.html')
    cy.addEachProductToCart() //dodaj wszystkie
    cy.moveTo(
      'Complete',
      checkoutDetails.firstName,
      checkoutDetails.lastName,
      checkoutDetails.postCode
    )
    cy.get('.shopping_cart_link').should('be.visible') //czy koszyk widoczny i pusty
    cy.get('.shopping_cart_link').should('be.empty').click() //przejdz do koszyka w '/cart.html'
    cy.url().should('contain', '/cart.html')
    cy.get('.shopping_cart_link').should('be.empty') //sprawdz koszyk w '/cart.html'
    cy.get('.cart_list').children().should('have.length', 2) //spawdz '.cart_list' czy elemety usuniete z koszyka
    cy.get('#continue-shopping').should('be.visible').click() //przejdz do '/inventory.html'
    cy.url().should('contain', '/inventory.html')
    cy.get('.shopping_cart_link').should('be.empty') //sprawdz koszyk w '/inventory.html'
    cy.checkIfAddToCartButtonReset('Add to cart', 0) //sprawdz czy buttony zresetowane w '/inventory.html'
    cy.visit('/checkout-complete.html') //przejdz do 'checkout: Complete!'

    cy.checkHeader('Checkout: Complete!')
    cy.checkFooter()

    cy.get('#checkout_complete_container')
      .children()
      .eq(0)
      .should('have.text', 'THANK YOU FOR YOUR ORDER')
    cy.get('#checkout_complete_container')
      .children()
      .eq(1)
      .should(
        'have.text',
        'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
      )
    cy.get('#checkout_complete_container').children().eq(2).should('be.visible')
    cy.get('#checkout_complete_container')
      .children()
      .eq(3)
      .should('have.text', 'Back Home')
      .click()
    cy.url().should('contain', '/inventory.html')
  })
})
