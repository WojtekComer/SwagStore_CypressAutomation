/// <reference types ="Cypress"/>

import burgerMenuItems from '../fixtures/burgerMenu.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')
let checkoutDetails = Cypress.env('checkoutInfo')

describe(
  "\n6.1 'CHECKOUT: COMPLETE' PAGE - BURGER MENU TEST\n",
  { testIsolation: false },
  () => {
    before('Login - Reset App State - Logout', () => {
      cy.resetAppState(loginy.username, loginy.password)
    })

    it.each(burgerMenuItems)(
      (z, l, t) =>
        myClassTestDescAndDate.testDescription(z, l, t, 'testingBurgerMenu'),
      (menu) => {
        cy.doIfMenuOptionIs(
          'Complete',
          menu.menuItem,
          loginy.username,
          loginy.password
        )
        cy.moveTo(
          'Complete',
          checkoutDetails.firstName,
          checkoutDetails.lastName,
          checkoutDetails.postCode
        )
        cy.checkCurrentMenuOption(menu.menuItem) //czy aktualna opcja w petli zgodna z opisem

        if (menu.menuItem != 'About') {
          //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

          if (menu.menuItem == 'Reset App State') {
            cy.get('.shopping_cart_link').should('be.empty')
            cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
            //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza
            //test mialby na celu sprawdzenie czy strona sie odswiezyla po kliknieciu 'Reset App State'

            cy.closeMenu() //ta funkcja nie mialaby sensu gdyby dzialalo odswiezanie
          } else {
            cy.checkMenuOptionActionResult(
              'Complete',
              menu.menuItem,
              menu.action
            )
          }
        } else {
          cy.ifMenuOptionAbout('Complete')
        }
      }
    )
  }
)
