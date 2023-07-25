/// <reference types ="Cypress"/>
import daneLogowania from '../fixtures/loginyTest4.json'
import artykuly from '../fixtures/artukulyTest4.json'
import burgerMenuItems from '../fixtures/burgerMenuTest4.json'
import selectOptions from '../fixtures/sortMenuTest4.json'
import checkoutForm from '../fixtures/checkoutFormTest4.json'
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

        cy.sprawdzPlaceholder('.login-box', '#user-name', 'Username') //sprawdzenie placeholdera 'Username'
        cy.sprawdzPlaceholder('.login-box', '#password', 'Password') //sprawdzenie placeholdera 'Password'  
        cy.get('.form_group').siblings().eq(2).should('exist') //sprawdzenie istnienia 'error-message-container error'
        cy.get('.login-box').find('#login-button').should('be.visible').should('have.value','Login') //login button 

    })

    it('\n---LOGIN FUNCTIONALITY TEST---\nNumber of tests: 8\n', () => { })

    it.each(daneLogowania)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyLogowania'), (login) => {  //testy logowania z roznymi opcjami

        cy.mojLoginSwagStore(login.user, login.pass)

        if (login.itemcheck == '[data-test=\"error\"]') {   //w przypadku podania niepoprawnych danych
            cy.get('.error-message-container').should('not.be.empty')  //'error-message-container' dostaje zawartosc obsugujaca blad
            cy.get(login.itemcheck).should('contain', login.expectedResult)
            cy.get(login.itemcheck).children().click()  //po zamknieciu 'error-message-container'
            cy.get('.error-message-container').should('be.empty')  //po zamknieciu 'error-message-container' powinien byc pusty
            //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne 
        }
        if (login.itemcheck == '.inventory_item') {  // w przypadku poprawnego zalogowania
            cy.url().should('include', 'inventory.html')   //sprawdzienie przekierowania do /inventory.html
            cy.get(login.itemcheck).should('have.length', login.expectedResult).should('not.be.empty')
        }
        if (login.user == 'problem_user') {       //sprawdzenie obrazka / jpg  dla loginu 'problem_user' 
            cy.get(login.itemcheck).should('be.visible').should('have.length', 6).should('have.attr', 'src')
        }
    })

})

describe('\n2. INVENTORY (PRODUCTS) PAGE TEST\n', () => {

    it('\n---PRODUCT DESC. & \'ADD TO CART\' TEST---\nNumber of tests: 6\n', () => { })

    it.each(artykuly)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyArtukulow'), (danyArtykul) => {
        //test wyswietlania info o artykulach na stornie /inventory.html
        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        //sprawdzenie opisow i cen:
        cy.sprawdzOpisProduktuInventory(danyArtykul)

        //testowanie buttona 'Add to cart' / 'Remove':
        cy.get('.shopping_cart_link').should('be.empty') //czy koszyk jest pusty na starcie ?
        cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //parametry: co dodac, ile ma byc w koszyku po 
        cy.usunJedenZKoszyka('.inventory_list', danyArtykul.artykul, 0) //parametry: skad usunac, co usunac, ile ma byc w koszyku po
        cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //po usunieciu ponownie dodaje i sprawdzam ilosc w koszyku

    })

    it('\n---BURGER MENU TEST---\nNumber of tests: 4\n', () => { })

    it.each(burgerMenuItems)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyBurgerMenu'), (menu) => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
        cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
        cy.get('.bm-item-list').contains(menu.menuItem).should('have.text', menu.menuItem) //czy zgodne z opisem

        if (menu.menuItem != 'About') {   //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

            if (menu.menuItem == 'All Items') { cy.checkPageReload('All Items') } // jak sie sprawdza czy strona sie odswieza ?
            if (menu.menuItem == 'Reset App State') {  //sprawdzenie dzialania opcji 'Reset App state'

                cy.dodajKazdyDoKoszyka()
                cy.czyAddToCartButtonReset('Remove', 6)
                cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
                //cy.checkPageReload('Reset App State') //to by bylo zamiast powyzszej instukcji ale wiem, ze nie odswieza
                //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                cy.get('.bm-cross-button').should('be.visible').click()
                cy.get('.bm-item-list').should('not.be.visible')  //sprawdzenie czy dziala button 'X' zamykajacy menu
                //cy.reload() //dla testu funkcji czyAddToCartButtonReset() bo jest defekt i nie odswieza strony po 'Reset App State'
                cy.czyAddToCartButtonReset('Add to cart', 0)

            }
            else {
                cy.get('.bm-item-list').contains(menu.menuItem).click() //klika w aktualna opcje zeby sprawdzic przekierowanie 
                cy.url().should('contain', menu.action)  //czy dziala przekierowanie ?
            }
        }
        else {
            cy.get('.bm-item-list').contains(menu.menuItem).should('have.attr', 'href')
            cy.get('.bm-item-list').contains(menu.menuItem).invoke('attr', 'href').should('contain', 'https://saucelabs.com/')
        }

    })

    it('\n---PRODUCT SORTING TEST---\nNumber of tests: 4\n', () => { })

    it.each(selectOptions)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'sortMenu'), (select) => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('.select_container').children().eq(1).select(select.sortType) //wybierz ktore sortowanie
        cy.get('.select_container').should('be.visible').children().eq(0).should('have.text', select.option)
        //sprawdz czy w menu poprwanie wyswietlany typ sortowania np.'Name (A to Z)' 

        switch (select.sortType) { //sprawdz poprawne posortowaie artukulow na stronie '/inventory.html'

            case 'za': cy.sprawdzSortowanieNazwArtykulow(select.result); break;
            case 'az': cy.sprawdzSortowanieNazwArtykulow(select.result); break;
            case 'lohi': cy.sprawdzSortowanieCenArtykulow(select.result); break;
            case 'hilo': cy.sprawdzSortowanieCenArtykulow(select.result); break;
            default: cy.log("Niepoprawny parametr w 'Switch'")

        }

    })

    it('\n---INVENTORY (PRODUCTS) PAGE APPEARANCE TEST---\nNumber of tests: 1\n', () => { })

    it(`Test 1/1 - Check Inventory (Products) page appearance\n${mojaKlasaTest4.czasTestu()}`, () => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.sprawdzHeader('Products')
        cy.get('.header_secondary_container').find('.title').siblings().eq(0).should('be.visible') //sprawdz logo robot w header

        cy.sprawdzFooter()

    })

})

describe('\n3. \'YOUR CART\' PAGE TEST\n', () => {

    it('\n---EMPTY CART TEST---\nNumber of tests: 1\n', () => { })

    it(`Test 1/1 - Checking empty cart.\n${mojaKlasaTest4.czasTestu()}`, () => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.url().should('contain', '/inventory.html')
        cy.get('.shopping_cart_link').should('be.empty').click() // czy koszyk jest pusty na starcie ?

        cy.url().should('contain', '/cart.html')
        cy.get('.shopping_cart_link').should('be.empty')
        cy.sprawdzHeader('Your Cart')
        cy.sprawdzFooter()
        cy.get('.cart_quantity_label').should('have.text', 'QTY')
        cy.get('.cart_desc_label').should('have.text', 'DESCRIPTION')

        cy.get('.cart_list').children().should('have.length', 2) //brak produktow ('.cart_item') w koszyku

        cy.get('#checkout').should('be.visible')
        cy.get('#continue-shopping').should('be.visible').click()
        cy.url().should('contain', '/inventory.html')

    })

    it('\n---\'YOUR CART\' TEST - ADD / REMOVE ONE BY ONE---\nNumber of tests: 6\n', () => { })

    it.each(artykuly)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyCartPojedynczo'), (danyArtykul) => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
        cy.dodajJedenDoKoszyka(danyArtykul.artykul, 1) //dodaj produkt
        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka

        cy.url().should('contain', '/cart.html')
        cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 1)
        cy.get('.cart_list').children().should('have.length', 3) // -> (2 zawsze) + 1 = jest 1 produkt '.cart_item' w koszyku

        cy.sprawdzOpisProduktuCart(danyArtykul) //testowanie opisow, ilosci i cen w koszyku

        cy.get('.cart_list').contains('div', danyArtykul.artykul).parent().siblings().eq(1).children()
            .eq(1).should('contain', 'Remove').click() //usun z koszyka
        cy.get('.cart_list').children().should('have.length', 3).eq(2).should('have.class', 'removed_cart_item')
        cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
        cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory

        cy.url().should('contain', '/inventory.html')
        cy.get('.shopping_cart_link').should('be.empty') //koszyk ma byc pusty
        cy.get('.inventory_list').contains(danyArtykul.artykul).parent().siblings().children().eq(1)
            .should('contain', 'Add to cart')  //button add to cart ma byc zresetowany

    })

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
                if (licznik == 6) { cy.get('.shopping_cart_link').should('be.empty') }
                else { cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6 - licznik) }

            })

        })

        cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory
        cy.czyAddToCartButtonReset('Add to cart', 0) //czy 'usun z koszyka' (linia 238 ) ma efekt na buttony w '/inventory.html'

    })

})

describe('\n3.1 \'YOUR CART\' PAGE - BURGER MENU TEST\n', { testIsolation: false } , () => {

    it('\n---\'YOUR CART\' TEST - BURGER MENU---\nNumber of tests: 4\n', () => {
        cy.mojLoginSwagStore(loginy.username, loginy.password)
    })

    it.each(burgerMenuItems)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyBurgerMenu'), (menu) => {

        if(menu.menuItem == 'Reset App State') { // po poprzednim kroku 'Logout'
            cy.mojLoginSwagStore(loginy.username, loginy.password) //loguj
            cy.czyAddToCartButtonReset('Remove', 6) //czy pamieta stan koszyka i buttonow po poprzednim kroku 'Logout'
        }

        if(menu.menuItem == 'Logout') {cy.visit('/inventory.html') } //tylko opja 'Logout' tego wymaga

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
        cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
        cy.get('.bm-item-list').contains(menu.menuItem).should('have.text', menu.menuItem) //czy zgodne z opisem

        if (menu.menuItem != 'About') {   //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

            if (menu.menuItem == 'Reset App State') {  //sprawdzenie dzialania opcji 'Reset App state'

                //czy pamieta stan koszyka - '/cart.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6) 
                cy.get('.cart_list').children().should('have.length', 8)
                cy.fixture('artukulyTest4').then((produkty) => {
                    produkty.forEach((produkt) => {
                        cy.sprawdzOpisProduktuCart(produkt)
                    })
            
                })

                cy.get('.bm-item-list').contains('Reset App State').click() //resetuje Apke
                //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem ze nie odswieza
                //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                cy.get('.bm-cross-button').should('be.visible').click()
                cy.get('.bm-item-list').should('not.be.visible')  //sprawdzenie czy dziala button 'X' zamykajacy menu

                cy.get('.shopping_cart_link').should('be.empty')
                //cy.reload() //dla testu czy usuwa produkty z koszyka bo jest defekt i nie odswieza strony po 'Reset App State'
                cy.get('.cart_list').children().should('have.length', 2) //czy usunal produkty z koszyka

                cy.get('#continue-shopping').should('be.visible').click()  //powrot do inventory
                cy.czyAddToCartButtonReset('Add to cart', 0)

            }
            else {
                cy.get('.bm-item-list').contains(menu.menuItem).click() //klika w aktualna opcje zeby sprawdzic przekierowanie 
                cy.url().should('contain', menu.action)  //czy dziala przekierowanie ?
                if (menu.menuItem == 'All Items') { 
                    cy.dodajKazdyDoKoszyka() //w pierwszym kroku dodaj wszystkie produkty do koszyka
                }  
            }
        }
        else { //jesli opcja: 'About'
            cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', 6) //spawdza stan koszyka na '/cart.html'
            cy.get('.cart_list').children().should('have.length', 8)
            cy.get('.bm-item-list').contains(menu.menuItem).should('have.attr', 'href') //sprawdza link dla opcji 'About'
            cy.get('.bm-item-list').contains(menu.menuItem).invoke('attr', 'href').should('contain', 'https://saucelabs.com/')
        }

    })


})

describe('\n4. \'CHECKOUT: YOUR INFORMATION\' PAGE TEST\n', () => {

    it('\n---\'CHECKOUT: YOUR INFORMATION\' PAGE APPEARANCE TEST---\nNumber of tests: 1\n', () => { })

    it(`Test 1/1 - \'CHECKOUT: YOUR INFORMATION\' appearance test.\n${mojaKlasaTest4.czasTestu()}`, () => {

        cy.zrobSesje(loginy.username, loginy.password)
        cy.visit('/inventory.html')

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html 

        cy.url().should('contain','/checkout-step-one.html')
        cy.get('.shopping_cart_link').should('be.empty')
        cy.sprawdzHeader('Checkout: Your Information')
        cy.sprawdzFooter()
        
        cy.sprawdzPlaceholder('.checkout_info', '#first-name', 'First Name')
        cy.sprawdzPlaceholder('.checkout_info', '#last-name', 'Last Name')
        cy.sprawdzPlaceholder('.checkout_info', '#postal-code', 'Zip/Postal Code')
        cy.get('.checkout_info').children().eq(3).should('exist')    // '.error-message-container'
        cy.get('.error-message-container').should('be.empty') // '.error-message-container'
        cy.get('#continue').should("be.visible")
        cy.get('#cancel').should("be.visible").click()
        cy.url().should('contain','/cart.html')

    })

    it('\n---\'CHECKOUT: YOUR INFORMATION\' FORM TEST---\nNumber of tests: 4\n', () => { })

    it.each(checkoutForm)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'checkoutFormTest'), (formularz) => {  //testy logowania z roznymi opcjami

        cy.zrobSesje(loginy.username, loginy.password)
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

    it('\n---\'CHECKOUT: YOUR INFORMATION\' TEST - BURGER MENU---\nNumber of tests: 4\n', () => {
        cy.mojLoginSwagStore(loginy.username, loginy.password)
    })

    it.each(burgerMenuItems)((z, l, t) => mojaKlasaTest4.testDescription(z, l, t, 'testyBurgerMenu'), (menu) => {

        if(menu.menuItem == 'Reset App State') { // po poprzednim kroku 'Logout'
            cy.mojLoginSwagStore(loginy.username, loginy.password) //loguj
            cy.czyAddToCartButtonReset('Remove', 6) //czy pamieta stan koszyka i buttonow po poprzednim kroku 'Logout'
        }

        if(menu.menuItem == 'Logout') {cy.visit('/inventory.html') } //tylko opja 'Logout' tego wymaga

        cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
        cy.url().should('contain', '/cart.html')
        cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html 
        cy.url().should('contain','/checkout-step-one.html')

        cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
        cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
        cy.get('.bm-item-list').contains(menu.menuItem).should('have.text', menu.menuItem) //czy zgodne z opisem

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
                cy.czyAddToCartButtonReset('Add to cart', 0) //czy buttony 'Add to cart' w zresetowane w '/inventory.html'

            }
            else {
                cy.get('.bm-item-list').contains(menu.menuItem).click() //klika w aktualna opcje zeby sprawdzic przekierowanie 
                cy.url().should('contain', menu.action)  //czy dziala przekierowanie ?
                if (menu.menuItem == 'All Items') { 
                    cy.dodajKazdyDoKoszyka() //w pierwszym kroku dodaj wszystkie produkty do koszyka 
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