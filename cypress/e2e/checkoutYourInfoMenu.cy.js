/// <reference types ="Cypress"/>

import burgerMenuItems from '../fixtures/burgerMenu.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')

describe(
  "\n4.1 'CHECKOUT: YOUR INFORMATION' PAGE - BURGER MENU TEST\n",
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
          'checkoutYourInfo',
          menu.menuItem,
          loginy.username,
          loginy.password
        )
        cy.moveTo('checkoutYourInfo', 'noNeed', 'noNeed', 'noNeed')
        cy.checkCurrentMenuOption(menu.menuItem) //czy aktualna opcja w petli zgodna z opisem

        if (menu.menuItem != 'About') {
          //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

          if (menu.menuItem == 'Reset App State') {
            //czy pamieta stan koszyka w '/checkout-step-one.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
            cy.checkAfterMenuLogout('checkoutYourInfo')

            cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
            //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza

            cy.closeMenu()
            cy.checkAfterResetApp('checkoutYourInfo')
          } else {
            cy.checkMenuOptionActionResult(
              'checkoutYourInfo',
              menu.menuItem,
              menu.action
            )
          }
        } else {
          cy.ifMenuOptionAbout('checkoutYourInfo')
        }
      }
    )
  }
)
