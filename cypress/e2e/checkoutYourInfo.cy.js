/// <reference types ="Cypress"/>

import checkoutForm from '../fixtures/checkoutForm.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')

describe("\n4. 'CHECKOUT: YOUR INFORMATION' PAGE TEST\n", () => {
  it(`Test 1/1 - \'CHECKOUT: YOUR INFORMATION\' appearance test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
    cy.createSession(loginy.username, loginy.password)
    cy.visit('/inventory.html')

    cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
    cy.url().should('contain', '/cart.html')
    cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html

    cy.url().should('contain', '/checkout-step-one.html')
    cy.get('.shopping_cart_link').should('be.empty')
    cy.checkHeader('Checkout: Your Information')
    cy.checkFooter()

    cy.checkPlaceholder('.checkout_info', '#first-name', 'First Name')
    cy.checkPlaceholder('.checkout_info', '#last-name', 'Last Name')
    cy.checkPlaceholder('.checkout_info', '#postal-code', 'Zip/Postal Code')
    cy.get('.checkout_info').children().eq(3).should('exist') // '.error-message-container'
    cy.get('.error-message-container').should('be.empty') // '.error-message-container'
    cy.get('#continue').should('be.visible')
    cy.get('#cancel').should('be.visible').click()
    cy.url().should('contain', '/cart.html')
  })

  it.each(checkoutForm)(
    (z, l, t) =>
      myClassTestDescAndDate.testDescription(z, l, t, 'testingCheckoutForm'),
    (formularz) => {
      //testy logowania z roznymi opcjami

      cy.createSession(loginy.username, loginy.password)
      cy.visit('/inventory.html')

      cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
      cy.url().should('contain', '/cart.html')
      cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html

      cy.fillInCheckoutForm(
        formularz.name,
        formularz.surname,
        formularz.postalCode
      )

      if (formularz.itemcheck == '[data-test="error"]') {
        //w przypadku podania niepoprawnych danych
        cy.get('.error-message-container').should('not.be.empty') //'error-message-container' dostaje zawartosc obsugujaca blad
        cy.get(formularz.itemcheck).should('contain', formularz.result)
        cy.get(formularz.itemcheck).children().click() //po zamknieciu 'error-message-container'
        cy.get('.error-message-container').should('be.empty') //po zamknieciu 'error-message-container' powinien byc pusty
        //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne
      } else {
        cy.url().should('contain', '/checkout-step-two.html')
      }
    }
  )
})
