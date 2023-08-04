/// <reference types ="Cypress"/>

import allLoginData from '../fixtures/loginData.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')

describe('\n1. LOGIN PAGE TEST\n', () => {
  it(`Test 1/1 - Check login page appearance.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
    //sprawdzenie poprawnosci stony logowania

    cy.visit('/')
    cy.url().should('include', 'SwagLabs') //sprawdzenie url
    cy.location('href').should('contain', '172.16.2.153:8080') //sprawdzenie location
    cy.get('.login_logo').should('be.visible') //logo
    cy.get('.bot_column').should('be.visible') //bot logo

    cy.checkPlaceholder('.login-box', '#user-name', 'Username') //sprawdzenie placeholdera 'Username'
    cy.checkPlaceholder('.login-box', '#password', 'Password') //sprawdzenie placeholdera 'Password'
    cy.get('.form_group').siblings().eq(2).should('exist') //sprawdzenie istnienia 'error-message-container error'
    cy.get('.login-box')
      .find('#login-button')
      .should('be.visible')
      .should('have.value', 'Login') //login button
  })

  it.each(allLoginData)(
    (z, l, t) =>
      myClassTestDescAndDate.testDescription(z, l, t, 'testingLogging'),
    (login) => {
      //testy logowania z roznymi opcjami
      cy.myLoginSwagStore(login.user, login.pass)

      if (login.itemcheck == '[data-test="error"]') {
        //w przypadku podania niepoprawnych danych
        cy.get('.error-message-container').should('not.be.empty') //'error-message-container' dostaje zawartosc obsugujaca blad
        cy.get(login.itemcheck).should('contain', login.expectedResult)
        cy.get(login.itemcheck).children().click() //po zamknieciu 'error-message-container'
        cy.get('.error-message-container').should('be.empty') //po zamknieciu 'error-message-container' powinien byc pusty
      }
      if (login.itemcheck == '.inventory_item') {
        // w przypadku poprawnego zalogowania
        cy.url().should('include', 'inventory.html') //sprawdzienie przekierowania do /inventory.html
        cy.get(login.itemcheck)
          .should('have.length', login.expectedResult)
          .should('not.be.empty')
      }
      if (login.user == 'problem_user') {
        //sprawdzenie obrazka / jpg  dla loginu 'problem_user'
        cy.get(login.itemcheck)
          .should('be.visible')
          .should('have.length', 6)
          .should('have.attr', 'src')
        cy.get(login.itemcheck)
          .invoke('attr', 'src')
          .should('contain', login.expectedResult)
      }
    }
  )
})
