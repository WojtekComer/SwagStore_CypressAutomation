/// <reference types ="Cypress"/>

import burgerMenuItems from '../fixtures/burgerMenu.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')

describe(
  '\n2.1 INVENTORY (PRODUCTS) PAGE - BURGER MENU TEST\n',
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
          'Inventory',
          menu.menuItem,
          loginy.username,
          loginy.password
        )

        cy.checkCurrentMenuOption(menu.menuItem) //czy aktualna opcja w petli zgodna z opisem

        if (menu.menuItem != 'About') {
          //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

          if (menu.menuItem == 'Reset App State') {
            //czy pamieta stan koszyka w '/inventory.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
            cy.checkAfterMenuLogout('Inventory')
            cy.get('.select_container').children().eq(1).select('za') //posortuj malejaco

            cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
            //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza

            cy.closeMenu()
            cy.get('.shopping_cart_link').should('be.empty') //spawdza koszyk w '/checkout-step-two.html'

            //DEFEKT - nie odswieza strony po 'Reset App State'.
            //cy.reload() //wymusza odswiezenie strony
            //Po odkomentowaniu powyzszej instrukcji przechodzi test

            cy.checkProductsNamesSorting('be.ascending') //po 'Reset App State' powinno byc domyslnie malejaco posortowane
            cy.checkIfAddToCartButtonReset('Add to cart', 0) //czy buttony 'Add to cart' zresetowane w '/inventory.html'
          } else {
            cy.checkMenuOptionActionResult(
              'Inventory',
              menu.menuItem,
              menu.action
            )
          }
        } else {
          cy.ifMenuOptionAbout('Inventory') //jesli opcja: 'About'
        }
      }
    )
  }
)
