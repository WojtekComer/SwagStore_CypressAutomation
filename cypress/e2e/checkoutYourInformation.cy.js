/// <reference types ="Cypress"/>

import burgerMenuItems from '../fixtures/burgerMenu.json'
import checkoutForm from '../fixtures/checkoutForm.json'
import { myClassTestDescAndDate } from './myClassTestDescAndDate'

let loginy = Cypress.env('swagTesting')

describe('\n4. \'CHECKOUT: YOUR INFORMATION\' PAGE TEST\n', () => {

    it(`Test 1/1 - \'CHECKOUT: YOUR INFORMATION\' appearance test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {

        cy.createSession(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html 

        cy.url().should('contain','/checkout-step-one.html')
        cy.get('.shopping_cart_link').should('be.empty')
        cy.checkHeader('Checkout: Your Information')
        cy.checkFooter()
        
        cy.checkPlaceholder('.checkout_info', '#first-name', 'First Name')
        cy.checkPlaceholder('.checkout_info', '#last-name', 'Last Name')
        cy.checkPlaceholder('.checkout_info', '#postal-code', 'Zip/Postal Code')
        cy.get('.checkout_info').children().eq(3).should('exist')    // '.error-message-container'
        cy.get('.error-message-container').should('be.empty') // '.error-message-container'
        cy.get('#continue').should("be.visible")
        cy.get('#cancel').should("be.visible").click()
        cy.url().should('contain','/cart.html')

    })

    it.each(checkoutForm)((z, l, t) => myClassTestDescAndDate.testDescription(z, l, t, 'testingCheckoutForm'), (formularz) => {  //testy logowania z roznymi opcjami

        cy.createSession(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html 
        cy.url().should('contain','/checkout-step-one.html')
        //cy.get('.shopping_cart_link').should('be.empty')

        cy.get('.checkout_info').find('#first-name').type(formularz.name)
        cy.get('.checkout_info').find('#last-name').type(formularz.surname)
        cy.get('.checkout_info').find('#postal-code').type(formularz.postalCode)
        cy.get('#continue').should("be.visible").click()

        if (formularz.itemcheck == "[data-test=\"error\"]") {   //w przypadku podania niepoprawnych danych
            cy.get('.error-message-container').should('not.be.empty')  //'error-message-container' dostaje zawartosc obsugujaca blad
            cy.get(formularz.itemcheck).should('contain', formularz.result)
            cy.get(formularz.itemcheck).children().click()  //po zamknieciu 'error-message-container'
            cy.get('.error-message-container').should('be.empty')  //po zamknieciu 'error-message-container' powinien byc pusty
            //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne 
        }
        else{
            cy.url().should('contain','/checkout-step-two.html')
        }

    })

})

describe('\n4.1 \'CHECKOUT: YOUR INFORMATION\' PAGE - BURGER MENU TEST\n', { testIsolation: false } , () => {

    it.each(burgerMenuItems)((z, l, t) => myClassTestDescAndDate.testDescription(z, l, t, 'testingBurgerMenu'), (menu) => {

        if (menu.menuItem == "All Items") {
            cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
        }
        if(menu.menuItem == 'Reset App State') { // po poprzednim kroku 'Logout'
            cy.myLoginSwagStore(loginy.username, loginy.password) //loguj
            cy.checkIfAddToCartButtonReset('Remove', 6) //czy pamieta stan koszyka i buttonow po poprzednim kroku 'Logout'
        }

        if(menu.menuItem == 'Logout') {cy.visit('/inventory.html') } //tylko opja 'Logout' tego wymaga

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html 
        cy.url().should('contain','/checkout-step-one.html')

        cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
        cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
        cy.get('.bm-item-list').contains(menu.menuItem).should('have.text', menu.menuItem) //czy zgodne z descriptionem

        if (menu.menuItem != 'About') {   //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

            if (menu.menuItem == 'Reset App State') {  //sprawdzenie dzialania opcji 'Reset App state'

                //czy pamieta stan koszyka w '/checkout-step-one.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6) 

                cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
                //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza
                //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                cy.get('.bm-cross-button').should('be.visible').click()
                cy.get('.bm-item-list').should('not.be.visible')  //sprawdzenie czy dziala button 'X' zamykajacy menu

                cy.get('.shopping_cart_link').should('be.empty') //spawdza koszyk w '/checkout-step-one.html'
                cy.get('#cancel').should("be.visible").click() //powrot do '/cart.html' 

                cy.get('.shopping_cart_link').should('be.empty') //spawdza koszyk w '/cart.html'
                cy.get('.cart_list').children().should('have.length', 2) //spawdza '.cart_list' czy elemety usuniete koszyka
                cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory
                cy.checkIfAddToCartButtonReset('Add to cart', 0) //czy buttony 'Add to cart' w zresetowane w '/inventory.html'

            }
            else {
                cy.get('.bm-item-list').contains(menu.menuItem).click() //klika w aktualna opcje zeby sprawdzic przekierowanie 
                cy.url().should('contain', menu.action)  //czy dziala przekierowanie ?
                if (menu.menuItem == 'All Items') { 
                    cy.addEachProductToCart() //w pierwszym kroku dodaj wszystkie products do koszyka 
                }  
            }
        }
        else { //jesli opcja: 'About'
            cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6) //spawdza koszyk w '/checkout-step-one.html'
            cy.get('.bm-item-list').contains(menu.menuItem).should('have.attr', 'href') //sprawdza link dla opcji 'About'
            cy.get('.bm-item-list').contains(menu.menuItem).invoke('attr', 'href').should('contain', 'https://saucelabs.com/')
        }

    })


})