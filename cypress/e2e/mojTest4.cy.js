/// <reference types ="Cypress"/>
import daneLogowania from '../fixtures/loginyTest4.json'
import artykuly from '../fixtures/artukulyTest4.json'
import burgerMenuItems from '../fixtures/burgerMenuTest4.json'
import selectOptions from '../fixtures/sortMenuTest4.json'
import { mojaKlasaTest4 } from './mojaKlasaTest4'

let loginy = Cypress.env('swagTesting')

describe('\n1. LOGIN PAGE TEST\n', () => {

    it('\n----LOGIN PAGE APPEARANCE TEST----\nNumber of tests: 1\n', () => { })

    it(`Test 1/1 - Check login page appearance.\n${mojaKlasaTest4.czasTestu()}`, () => {  //sprawdzenie poprawnosci stony logowania

        cy.visit('/')
        cy.url().should('include', 'SwagLabs')   //sprawdzenie url
        cy.location('href').should('contain', '172.16.2.153:8080')  //sprawdzenie location
        cy.get('.login_logo').should('be.visible') //logo
        cy.get('.bot_column').should('be.visible') //bot logo
        cy.get('#user-name').should('have.attr', 'placeholder')
        cy.get('#user-name').invoke('attr', 'placeholder').should('contain', 'Username') //sprawdzenie placeholdera 'Username'
        cy.get('#password').should('have.attr', 'placeholder')
        cy.get('#password').invoke('attr', 'placeholder').should('contain', 'Password')  //sprawdzenie placeholdera 'Password'
        cy.get('.form_group').siblings().eq(2).should('exist')   //sprawdzenie istnienia 'error-message-container error'

    })

    //     it('\n---LOGIN FUNCTIONALITY TEST---\nNumber of tests: 8\n', () => {})

    //     it.each(daneLogowania)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyLogowania'), (login) => {  //testy logowania z roznymi opcjami

    //         cy.mojLoginSwagStore(login.user,login.pass)

    //         if(login.itemcheck == '[data-test=\"error\"]') {   //w przypadku podania niepoprawnych danych
    //             cy.get('.error-message-container').should('not.be.empty')  //'error-message-container' dostaje zawartosc obsugujaca blad
    //             cy.get(login.itemcheck).should('contain',login.expectedResult) 
    //             cy.get(login.itemcheck).children().click()  //po zamknieciu 'error-message-container'
    //             cy.get('.error-message-container').should('be.empty')  //po zamknieciu 'error-message-container' powinien byc pusty
    //             //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne 
    //         }
    //         if(login.itemcheck == '.inventory_item') {  // w przypadku poprawnego zalogowania
    //             cy.url().should('include','inventory.html')   //sprawdzienie przekierowania do /inventory.html
    //             cy.get(login.itemcheck).should('have.length',login.expectedResult).should('not.be.empty')
    //         }
    //         if(login.user == 'problem_user') {       //sprawdzenie obrazka / jpg  dla loginu 'problem_user' 
    //             cy.get(login.itemcheck).should('be.visible').should('have.length', 6).should('have.attr', 'src')
    //         }
    //     })

})

describe('\n2. INVENTORY (PRODUCTS) PAGE TEST\n', () => {

    // it('\n---PRODUCT DESC. & \'ADD TO CART\' TEST---\nNumber of tests: 6\n', () => { })

    // it.each(artykuly)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyArtukulow'), (danyArtykul) => {
    //     //test wyswietlania info o artykulach na stornie /inventory.html
    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')

    //     //sprawdzenie opisow i cen:
    //     cy.sprawdzOpisProduktuInventory(danyArtykul)

    //     //testowanie buttona 'Add to cart' / 'Remove':
    //     cy.get('.shopping_cart_link').should('be.empty') //czy koszyk jest pusty na starcie ?
    //     cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //parametry: co dodac, ile ma byc w koszyku po 
    //     cy.usunJedenZKoszyka('.inventory_list', danyArtykul.artykul, 0) //parametry: skad usunac, co usunac, ile ma byc w koszyku po
    //     cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //po usunieciu ponownie dodaje i sprawdzam ilosc w koszyku

    // })

    // it('\n---BURGER MENU TEST---\nNumber of tests: 4\n', () => { })

    // it.each(burgerMenuItems)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyBurgerMenu'), (menu) => {

    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')

    //     cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
    //     cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
    //     cy.get('.bm-item-list').contains(menu.menuItem).should('have.text', menu.menuItem) //czy zgodne z opisem

    //     if (menu.menuItem != 'About') {   //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

    //         if (menu.menuItem == 'All Items') { cy.checkPageReload('All Items') } // jak sie sprawdza czy strona sie odswieza ?
    //         if (menu.menuItem == 'Reset App State') {  //sprawdzenie dzialania opcji 'Reset App state'

    //             cy.dodajKazdyDoKoszyka()
    //             cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
    //             //cy.reload() //dla testu funkcji czyAddToCartButtonReset() bo jest defekt i nie odswieza strony po 'Reset App State'
    //             cy.czyAddToCartButtonReset()  

    //             cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
    //             cy.get('.bm-cross-button').should('be.visible').click()
    //             cy.get('.bm-item-list').should('not.be.visible')  //sprawdzenie czy dziala button 'X' zamykajacy menu

    //         }
    //         else {
    //             cy.get('.bm-item-list').contains(menu.menuItem).click() //klika w aktualna opcje zeby sprawdzic przekierowanie 
    //             cy.url().should('contain', menu.action)  //czy dziala przekierowanie ?
    //         }
    //     }
    //     else {
    //         cy.get('.bm-item-list').contains(menu.menuItem).should('have.attr', 'href')
    //         cy.get('.bm-item-list').contains(menu.menuItem).invoke('attr', 'href').should('contain', 'https://saucelabs.com/')
    //     }

    // })

    // it('\n---PRODUCT SORTING TEST---\nNumber of tests: 4\n', () => { })

    // it.each(selectOptions)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'sortMenu'), (select) => {

    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')

    //     cy.get('.select_container').children().eq(1).select(select.sortType) //wybierz ktore sortowanie
    //     cy.get('.select_container').should('be.visible').children().eq(0).should('have.text', select.option)
    //     //sprawdz czy w menu poprwanie wyswietlany typ sortowania np.'Name (A to Z)' 

    //     switch (select.sortType) { //sprawdz poprawne posortowaie artukulow na stronie '/inventory.html'

    //         case 'za': cy.sprawdzSortowanieNazwArtykulow(select.result); break;
    //         case 'az': cy.sprawdzSortowanieNazwArtykulow(select.result); break;
    //         case 'lohi': cy.sprawdzSortowanieCenArtykulow(select.result); break;
    //         case 'hilo': cy.sprawdzSortowanieCenArtykulow(select.result); break;
    //         default: cy.log("Niepoprawny parametr w 'Switch'")

    //     }

    // })

    // it('\n---INVENTORY (PRODUCTS) PAGE APPEARANCE TEST---\nNumber of tests: 1\n', () => { })

    // it(`Test 1/1 - Check Inventory (Products) page appearance\n${mojaKlasaTest4.czasTestu()}`, () => {

    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')

    //     cy.get('.app_logo').should('be.visible')
    //     cy.get('.header_secondary_container').find('.title').should('be.visible').should('have.text', 'Products')
    //         .siblings().eq(0).should('be.visible')
    //     cy.get('.footer').find('.footer_robot').should('be.visible')
    //     cy.get('.footer').find('.footer_copy').should('contain', ' Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy')
    //     //sprawdz linki
    //     cy.get('.footer').find('.social_twitter').should('be.visible').children().should('have.attr', 'href')
    //     cy.get('.footer').find('.social_twitter').children().invoke('attr', 'href').should('contain', 'https://twitter.com/saucelabs')

    //     cy.get('.footer').find('.social_facebook').should('be.visible').children().should('have.attr', 'href')
    //     cy.get('.footer').find('.social_facebook').children().invoke('attr', 'href').should('contain', 'https://www.facebook.com/saucelabs')

    //     cy.get('.footer').find('.social_linkedin').should('be.visible').children().should('have.attr', 'href')
    //     cy.get('.footer').find('.social_linkedin').children().invoke('attr', 'href').should('contain', 'https://www.linkedin.com/company/sauce-labs/')

    // })



    ///////////////////////////Test isolation do dodania wszystkich/////////////////////////////
    // describe('---PRODUCTS DETAILS & ADDING TO CART FUNCTIONALITY TEST--- ', { testIsolation: false }, () => {

    //     it('\n---ADDING TO CART FUNCTIONALITY TEST---\nNumber of tests: 6\n', () => {
    //         cy.mojLoginSwagStore(loginy.username, loginy.password)
    //         cy.url().should('include', '/inventory.html')
    //     })

    //     let ilewKoszyku = 0

    //     it.each(artykuly)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyArtukulow'), (danyArtykul) => {    // test wyswietlania info o artykulow na stornie /inventory.html


    //         //cy.zrobSesje(loginy.username, loginy.password)
    //         //cy.visit('/inventory.html')
    //         //testowanie opisow i cen
    //         cy.log(ilewKoszyku)
    //         cy.get('.inventory_list').contains('div', danyArtykul.artykul).should('contain', danyArtykul.artykul)
    //         cy.get('.inventory_list').contains('div', danyArtykul.artykul).parent('a').siblings().should('contain', danyArtykul.opisArtykulu)
    //         cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(0).should('contain', danyArtykul.cena)
    //         cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(1)
    //             //testowanie buttona 'Add to cart'
    //             .should('contain', 'Add to cart').click() //dodaj do koszyka
    //         cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', ilewKoszyku + 1) //sprawdz ilosc produktow w koszyku
    //         cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(1)
    //             .should('contain', 'Remove').click() //usun z koszyka

    //         if (ilewKoszyku == 0) { cy.get('.shopping_cart_link').should('be.empty') }
    //         else { cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', ilewKoszyku) }

    //         cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(1)
    //             .should('contain', 'Add to cart').click()
    //         cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', ilewKoszyku + 1)
    //         ilewKoszyku = ilewKoszyku + 1

    //     })
    //})
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
})

describe('\n3. \'YOUR CART\' PAGE TEST\n', () => {

    // it('\n---EMPTY CART TEST---\nNumber of tests: 1\n', () => { })

    // it(`Test 1/1 - Checking empty cart.\n${mojaKlasaTest4.czasTestu()}`, () => {

    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')
    //     cy.url().should('contain','/inventory.html')
    //     cy.get('.shopping_cart_link').should('be.empty').click() // czy koszyk jest pusty na starcie ?

    //     cy.url().should('contain','/cart.html')
    //     cy.get('.shopping_cart_link').should('be.empty')
    //     cy.get('.app_logo').should('be.visible')
    //     cy.get('.title').should('contain','Your Cart')
    //     cy.get('.cart_quantity_label').should('have.text','QTY')
    //     cy.get('.cart_desc_label').should('have.text','DESCRIPTION')

    //     cy.get('.cart_list').children().should('have.length', 2) //brak produktow ('.cart_item') w koszyku

    //     cy.get('#checkout').should('be.visible')
    //     cy.get('#continue-shopping').should('be.visible').click()
    //     cy.url().should('contain','/inventory.html')

    // })

    // it('\n---\'YOUR CART\' TEST - ADD / REMOVE ONE BY ONE---\nNumber of tests: 6\n', () => { })

    // it.each(artykuly)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyCartPojedynczo'), (danyArtykul) => {

    //     cy.zrobSesje(loginy.username, loginy.password)
    //     cy.visit('/inventory.html')

    //     cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
    //     cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //dodaj produkt
    //     cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka

    //     cy.url().should('contain', '/cart.html')
    //     cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 1)
    //     cy.get('.cart_list').children().should('have.length', 3) // -> (2 zawsze) + 1 = jest 1 produkt '.cart_item' w koszyku

    //     cy.sprawdzOpisProduktuCart(danyArtykul) //testowanie opisow ilosci i cen w koszyku

    //     cy.get('.cart_list').contains('div', danyArtykul.artykul).parent().siblings().eq(1).children()
    //         .eq(1).should('contain', 'Remove').click() //usun z koszyka
    //     cy.get('.cart_list').children().should('have.length', 3).eq(2).should('have.class', 'removed_cart_item')
    //     cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
    //     cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory

    //     cy.url().should('contain', '/inventory.html')
    //     cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
    //     cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(1)
    //         .should('contain', 'Add to cart')  //button add to cart ma byc zresetowany

    // })

    it('\n---\'YOUR CART\' TEST - ADD/REMOVE ALL PRODUCTS---\nNumber of tests: 1\n', () => { })

    it(`Test 1/1 - Add / Remove all produts in cart.\n${mojaKlasaTest4.czasTestu()}`, () => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.dodajKazdyDoKoszyka()  //dodaj wszystkie
        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka

        cy.url().should('contain', '/cart.html')
        cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6)
        cy.get('.cart_list').children().should('have.length', 8) // -> (2 zawsze) + 6 = jest 6 produktow '.cart_item' w koszyku
        
        let licznik = 0
        cy.fixture('artukulyTest4').then((produkty) => {

            produkty.forEach((produkt) => {

                cy.sprawdzOpisProduktuCart(produkt) //testowanie opisow ilosci i cen w koszyku
                cy.get('.cart_list').contains('div', produkt.artykul).parent().siblings().eq(1).children()
                    .eq(1).should('contain', 'Remove').click() //usun z koszyka
                cy.get('.cart_list').children().should('have.length', 8).eq(2 + licznik).should('have.class', 'removed_cart_item')
                licznik = licznik + 1
                if(licznik == 6) { cy.get('.shopping_cart_link').should('be.empty') }
                else{ cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6 - licznik) }

            })

        })

        cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory
        cy.czyAddToCartButtonReset()

    })

})