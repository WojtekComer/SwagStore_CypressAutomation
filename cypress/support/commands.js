// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('mojLoginSwagStore', (user, pass) => {

    cy.visit('/')
    cy.url().should('include', 'SwagLabs')   //sprawdzenie url
    cy.get('[data-test="username"]').type(user)
    cy.get('[data-test="password"]').type(pass)
    cy.get('[data-test="login-button"]').click()
    //cy.url().should('include', 'inventory.html')

})

Cypress.Commands.add('sprawdzSortowanieCenArtykulow', (opcjaSortowania) => {

    cy.get('.inventory_list').should('be.visible').find('.inventory_item_price').map('innerText')
        .mapInvoke('slice', 1).map(Number).should(opcjaSortowania)  //sprawdza czy ceny posortowane w zaleznosci od 'opcjaSortowania'

})

Cypress.Commands.add('sprawdzSortowanieNazwArtykulow', (opcjaSortowania) => {

    cy.get('.inventory_list').should('be.visible').find('.inventory_item_name').map('innerText').should(opcjaSortowania)
    //sprawdza czy nazwy posortowane w zaleznosci od 'opcjaSortowania'

})

Cypress.Commands.add('zrobSesje', (log, pass) => {

    cy.session('Sesja logowanie do Swag Store', () => {   //utrzymanie sesji

        cy.mojLoginSwagStore(log, pass)
        cy.url().should('contain', '/inventory.html')

    })
})

Cypress.Commands.add('dodajJedenDoKoszyka', (ktoryProdukt, sprawdzIlosc) => {

    cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
    cy.get('.inventory_list').contains(ktoryProdukt).parent().siblings().children().eq(1)
        .should('contain', 'Add to cart').click() //dodaj do koszyka
    cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', sprawdzIlosc) //sprawdz ilosc produktow w koszyku

})

Cypress.Commands.add('dodajKazdyDoKoszyka', () => {

    let licznik = 0
    cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
    cy.get('.shopping_cart_link').should('be.empty') //czy koszyk jest pusty na starcie

    cy.fixture('artukulyTest4').then((produkty) => {
        produkty.forEach((produkt) => {
            cy.get('.inventory_list').contains(produkt.artykul).parent().siblings().children().eq(1)
                .should('contain', 'Add to cart').click() //dodaj do koszyka
                licznik = licznik + 1
            cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', licznik) // ile w koszyku
        })

    })

})

Cypress.Commands.add('usunJedenZKoszyka', (skadUsunac, ktoryProdukt, sprawdzIlosc) => {

    cy.get(skadUsunac).contains(ktoryProdukt).parent().siblings().children().eq(1)
        .should('contain', 'Remove').click() //usun z koszyka
    if (sprawdzIlosc == 0) {  //jesli koszyk ma byc pusty
        cy.get('.shopping_cart_link').should('be.empty')  //sprawdz ilosc, czy koszyk jest pusty ?
    }
    else { cy.get('.shopping_cart_link').should('not.be.empty').children().should('have.text', sprawdzIlosc) } //ile w koszyku?


})

Cypress.Commands.add('czyAddToCartButtonReset', () => { //sprawdza stan na '/inventory.html' po 'Reset App State' 

    cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
    cy.get('.shopping_cart_link').should('be.empty') //czy koszyk jest pusty na starcie
    cy.fixture('artukulyTest4').then((produkty) => {  //bierze dane z json'a z opisem artukulow/produktow 

        produkty.forEach((produkt) => {  //sprawdza kolejno produkty czy maja zresetowany button 'Add to cart'

            cy.get('.inventory_list').contains(produkt.artykul).parent().siblings().children().eq(1).map('innerText')
                .then(opisButtona => {
                    if (opisButtona != 'ADD TO CART') {  //jesli nie zresetowany tylko dalej w stanie 'Remove'

                        cy.log(`----- ERROR!!! ----  
                         Button \'Add to cart\' for below product: 
                         '${produkt.artykul}'
                         failed to reset afer choosing option: 
                        \'Reset App State\' from burger menu.`)

                    }
                })
            cy.get('.inventory_list').contains(produkt.artykul).parent().siblings().children().eq(1)
                .should('contain', 'Add to cart') //...buton przy kazdym produkcie ma byc zresetowany do stanu 'Add to cart'

        })

    })

})

Cypress.Commands.add('checkPageReload', (opcjaMenu) => {

    cy.window().then(w => w.beforeReload = true)
    cy.window().should('have.prop', 'beforeReload', true)  // initially the new property is there
    cy.get('.bm-item-list').contains(opcjaMenu).click() //reload
    cy.window().should('not.have.prop', 'beforeReload') // after reload the property should be gone

})

Cypress.Commands.add('sprawdzOpisProduktuInventory', (produkt) => {  //testowanie opisow i cen na invemtory

    cy.get('.inventory_list').contains('div', produkt.artykul).should('contain', produkt.artykul)
    cy.get('.inventory_list').contains('div', produkt.artykul).parent('a').siblings().should('contain', produkt.opisArtykulu)
    cy.get('.inventory_list').contains(produkt.artykul).parent().siblings().children().eq(0).should('contain', produkt.cena)
})

Cypress.Commands.add('sprawdzOpisProduktuCart', (produkt) => {   //testowanie opisow ilosci i cen w koszyku

    cy.get('.cart_list').contains('div', produkt.artykul).should('contain', produkt.artykul)
    cy.get('.cart_list').contains('div', produkt.artykul).parent().parent().siblings().should('have.text', 1)
    cy.get('.cart_list').contains('div', produkt.artykul).parent().siblings().eq(0).should('contain', produkt.opisArtykulu)
    cy.get('.cart_list').contains('div', produkt.artykul).parent().siblings().eq(1).children()
        .eq(0).should('contain', produkt.cena)
})