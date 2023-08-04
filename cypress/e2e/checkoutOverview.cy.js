/// <reference types ="Cypress"/>

import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')
let checkoutDetails = Cypress.env('checkoutInfo')

describe("\n5. 'CHECKOUT: OVERVIEW' PAGE TEST\n", () => {
  it(`Test 1/1 - \'CHECKOUT: OVERVIEW\' appearance test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
    cy.createSession(loginy.username, loginy.password)
    cy.visit('/inventory.html')

    cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
    cy.url().should('contain', '/cart.html')
    cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html

    cy.fillInCheckoutForm(
      checkoutDetails.firstName,
      checkoutDetails.lastName,
      checkoutDetails.postCode
    )

    cy.url().should('contain', '/checkout-step-two.html')
    cy.get('.shopping_cart_link').should('be.empty')
    cy.get('.cart_list').children().should('have.length', 2) //brak productow ('.cart_item') w koszyku
    cy.get('.cart_quantity_label').should('have.text', 'QTY')
    cy.get('.cart_desc_label').should('have.text', 'DESCRIPTION')

    cy.get('.summary_info')
      .contains('Payment Information:')
      .should('have.text', 'Payment Information:')
    cy.get('.summary_info')
      .contains('SauceCard #31337')
      .should('have.text', 'SauceCard #31337')
    cy.get('.summary_info')
      .contains('Shipping Information:')
      .should('have.text', 'Shipping Information:')
    cy.get('.summary_info')
      .contains('FREE PONY EXPRESS DELIVERY!')
      .should('have.text', 'FREE PONY EXPRESS DELIVERY!')

    cy.checkHeader('Checkout: Overview')
    cy.checkFooter()

    cy.get('#finish').should('be.visible')
    cy.get('#cancel').should('be.visible').click()
    cy.url().should('contain', '/cart.html')
    //cy.url().should("contain", "/inventory.html");

    //DEFEKT - po podmianie "/cart.html" na  "/inventory.html" przechodzi test
  })

  it(`Test 1/1 - \'CHECKOUT: OVERVIEW\' with full cart test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
    cy.createSession(loginy.username, loginy.password)
    cy.visit('/inventory.html')
    cy.addEachProductToCart() //dodaj wszystkie
    cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka

    cy.url().should('contain', '/cart.html')
    cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html
    //zrob checkout i przejdz do checkout:Overview
    cy.fillInCheckoutForm(
      checkoutDetails.firstName,
      checkoutDetails.lastName,
      checkoutDetails.postCode
    )

    cy.url().should('contain', '/checkout-step-two.html')
    cy.get('.shopping_cart_link')
      .should('not.be.empty')
      .children()
      .should('have.text', 6)
    cy.get('.cart_list').children().should('have.length', 8) //2+6 czyli 6 productow ('.cart_item') w koszyku\\

    let counter = 0
    cy.fixture('storeArticles').then((products) => {
      products.forEach((product) => {
        cy.checkCartProductDesc(product) //testowanie opisow, ilosci i cen w koszyku
        //sprawdz czy suma cen produktow = cenie wyswietlanej w 'Item total:'
        cy.get('.cart_item')
          .find('.inventory_item_price')
          .should('have.length', 6 - counter)
          .map('innerText') //pobierz tablice cen
          .mapInvoke('slice', 1)
          .map(Number)
          .apply(Cypress._.sum)
          .then((p) => Cypress._.round(p, 2)) //zaokraglij do 2 po przecinku

          //DEFEKT -> po zakomentowaniu powyzszej instrukcji test przechodzi

          .then((z) => {
            let sum1 = z
            cy.get('.summary_info') //
              .contains('Item total: $')
              .map('innerText')
              .mapInvoke('slice', 13)
              .map(Number)
              .apply(Cypress._.sum)
              .then((y) => {
                let sum2 = y
                expect(sum1).to.be.deep.equal(sum2)
              })
            //sprawdz czy tax obliczony z sumy cen = tax wyswietlany w 'Tax:'
            let tax1 = Cypress._.round((sum1 * 8) / 100, 2) //policz tax 8% i zaokraglij do 2
            cy.get('.summary_info')
              .contains('Tax: $')
              .map('innerText')
              .mapInvoke('slice', 6)
              .map(Number)
              .apply(Cypress._.sum)
              .then((n) => {
                let tax2 = n
                expect(tax1).to.be.deep.equal(tax2)
              })
            //sprawdz czy suma + tax obliczone z cen = total wyswietlany w 'Total:'
            let total1 = Cypress._.round(sum1 + tax1, 2) //policz suma + tax i zaokraglij do 2
            cy.get('.summary_info')
              .contains('Total: $')
              .map('innerText')
              .mapInvoke('slice', 8)
              .map(Number)
              .apply(Cypress._.sum)
              .then((m) => {
                let total2 = m
                expect(total1).to.be.deep.equal(total2)
              })
          })

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do '/cart.html'
        cy.get('.cart_list')
          .contains('div', product.article)
          .parent()
          .siblings()
          .eq(1)
          .children()
          .eq(1)
          .should('contain', 'Remove')
          .click() //usun z koszyka

        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html
        cy.fillInCheckoutForm(
          //zrob checkout i przejdz do checkout:Overview
          checkoutDetails.firstName,
          checkoutDetails.lastName,
          checkoutDetails.postCode
        )

        counter = counter + 1
        cy.get('.cart_list')
          .children()
          .should('have.length', 8 - counter)

        if (counter == 6) {
          cy.get('.shopping_cart_link').should('be.empty')
        } else {
          cy.get('.shopping_cart_link')
            .should('not.be.empty')
            .children()
            .should('have.text', 6 - counter)
        }
      })
    })
    //sprawdz podsumowanie cen po usunieciu zawartosci koszyka
    cy.get('.summary_info')
      .contains('Item total: $')
      .should('have.text', 'Item total: $0')
    cy.get('.summary_info').contains('Tax: $').should('have.text', 'Tax: $0.00')
    cy.get('.summary_info')
      .contains('Total: $')
      .should('have.text', 'Total: $0.00')
  })
})
