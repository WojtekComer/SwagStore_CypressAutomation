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

Cypress.Commands.add('myLoginSwagStore', (user, pass) => {
  cy.visit('/')
  cy.url().should('include', 'SwagLabs') //sprawdzenie url
  cy.get('[data-test="username"]').type(user)
  cy.get('[data-test="password"]').type(pass)
  cy.get('[data-test="login-button"]').click()
  //cy.url().should('include', 'inventory.html')
})

Cypress.Commands.add('checkProductsPricesSorting', (sortingOption) => {
  cy.get('.inventory_list')
    .should('be.visible')
    .find('.inventory_item_price')
    .map('innerText')
    .mapInvoke('slice', 1)
    .map(Number)
    .should(sortingOption) //sprawdza czy ceny posortowane w zaleznosci od 'sortingOption'
})

Cypress.Commands.add('checkProductsNamesSorting', (sortingOption) => {
  cy.get('.inventory_list')
    .should('be.visible')
    .find('.inventory_item_name')
    .map('innerText')
    .should(sortingOption)
  //sprawdza czy nazwy posortowane w zaleznosci od 'sortingOption'
})

Cypress.Commands.add('createSession', (log, pass) => {
  cy.session('Session - logging to Swag Store', () => {
    //utrzymanie sesji

    cy.myLoginSwagStore(log, pass)
    cy.url().should('contain', '/inventory.html')
  })
})

Cypress.Commands.add('addOneProductToCart', (whichProduct, qtyInCart) => {
  cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
  cy.get('.inventory_list')
    .contains(whichProduct)
    .parent()
    .siblings()
    .children()
    .eq(1)
    .should('contain', 'Add to cart')
    .click() //dodaj do koszyka
  cy.get('.shopping_cart_link')
    .should('not.be.empty')
    .children()
    .should('have.text', qtyInCart) //sprawdz ilosc productow w koszyku
})

Cypress.Commands.add('addEachProductToCart', () => {
  let counter = 0
  cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
  cy.get('.shopping_cart_link').should('be.empty') //czy koszyk jest pusty na starcie

  cy.fixture('storeArticles').then((products) => {
    products.forEach((product) => {
      cy.get('.inventory_list')
        .contains(product.article)
        .parent()
        .siblings()
        .children()
        .eq(1)
        .should('contain', 'Add to cart')
        .click() //dodaj do koszyka
      counter = counter + 1
      cy.get('.shopping_cart_link')
        .should('not.be.empty')
        .children()
        .should('have.text', counter) // ile w koszyku
    })
  })
})

Cypress.Commands.add('removeOneProductFromCart', (whichProduct, qtyInCart) => {
  cy.get('.inventory_list')
    .contains(whichProduct)
    .parent()
    .siblings()
    .children()
    .eq(1)
    .should('contain', 'Remove')
    .click() //usun z koszyka
  if (qtyInCart == 0) {
    //jesli koszyk ma byc pusty
    cy.get('.shopping_cart_link').should('be.empty') //sprawdz ilosc, czy koszyk jest pusty ?
  } else {
    cy.get('.shopping_cart_link')
      .should('not.be.empty')
      .children()
      .should('have.text', qtyInCart)
  } //ile w koszyku?
})

Cypress.Commands.add(
  'checkIfAddToCartButtonReset',
  (buttonStatus, qtyInCart) => {
    //sprawdza stan na '/inventory.html' po 'Reset App State'

    cy.url().should('contain', '/inventory.html') //czy jest na '/inventory.html'
    if (qtyInCart == 0) {
      cy.get('.shopping_cart_link').should('be.empty')
    } //czy koszyk jest pusty na starcie
    else {
      cy.get('.shopping_cart_link')
        .should('not.be.empty')
        .children()
        .should('have.text', qtyInCart)
    }

    cy.fixture('storeArticles').then((products) => {
      //bierze dane z json'a z descriptionem artukulow/productow

      products.forEach((product) => {
        //sprawdza kolejno products czy maja zresetowany button 'Add to cart'

        cy.get('.inventory_list')
          .contains(product.article)
          .parent()
          .siblings()
          .children()
          .eq(1)
          .map('innerText')
          .then((buttonDesc) => {
            if (buttonDesc != buttonStatus.toUpperCase()) {
              //jesli button w innym stanie niz podany w 'buttonStatus'

              cy.log(`----- ERROR!!! ----  
                         Button \'Add to cart\' for below product: 
                         '${product.article}' failed to reset`)
            }
          })
        cy.get('.inventory_list')
          .contains(product.article)
          .parent()
          .siblings()
          .children()
          .eq(1)
          .should('contain', buttonStatus) //...buton przy kazdym produkcie ma byc zresetowany do stanu 'Add to cart'
      })
    })
  }
)

Cypress.Commands.add('checkPageReload', (menuOption) => {
  cy.window().then((w) => (w.beforeReload = true))
  cy.window().should('have.prop', 'beforeReload', true) // initially the new property is there
  cy.get('.bm-item-list').contains(menuOption).click() //reload
  cy.window().should('not.have.prop', 'beforeReload') // after reload the property should be gone
})

Cypress.Commands.add('checkInventoryProductDesc', (product) => {
  //testowanie descriptionow i cen na invemtory

  cy.get('.inventory_list')
    .contains('div', product.article)
    .should('contain', product.article)
  cy.get('.inventory_list')
    .contains('div', product.article)
    .parent('a')
    .siblings()
    .should('contain', product.articleDescription)
  cy.get('.inventory_list')
    .contains(product.article)
    .parent()
    .siblings()
    .children()
    .eq(0)
    .should('contain', product.price)
})

Cypress.Commands.add('checkCartProductDesc', (product) => {
  //testowanie descriptionow ilosci i cen w koszyku

  cy.get('.cart_list')
    .contains('div', product.article)
    .should('contain', product.article)
  cy.get('.cart_list')
    .contains('div', product.article)
    .parent()
    .parent()
    .siblings()
    .should('have.text', 1)
  cy.get('.cart_list')
    .contains('div', product.article)
    .parent()
    .siblings()
    .eq(0)
    .should('contain', product.articleDescription)
  cy.get('.cart_list')
    .contains('div', product.article)
    .parent()
    .siblings()
    .eq(1)
    .children()
    .eq(0)
    .should('contain', product.price)
})

Cypress.Commands.add('checkLink', (whichMedia, link) => {
  cy.get('.footer')
    .find(whichMedia)
    .should('be.visible')
    .children()
    .should('have.attr', 'href')
  cy.get('.footer')
    .find(whichMedia)
    .children()
    .invoke('attr', 'href')
    .should('contain', link)
})

Cypress.Commands.add('checkFooter', () => {
  cy.get('.footer').find('.footer_robot').should('be.visible')
  cy.get('.footer')
    .find('.footer_copy')
    .should(
      'contain',
      ' Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy'
    )
  //sprawdz linki
  cy.checkLink('.social_twitter', 'https://twitter.com/saucelabs')
  cy.checkLink('.social_facebook', 'https://www.facebook.com/saucelabs')
  cy.checkLink(
    '.social_linkedin',
    'https://www.linkedin.com/company/sauce-labs/'
  )
})

Cypress.Commands.add('checkHeader', (title) => {
  cy.get('.app_logo').should('be.visible')
  cy.get('.header_secondary_container')
    .find('.title')
    .should('be.visible')
    .should('have.text', title)
})

Cypress.Commands.add('checkPlaceholder', (where, field, description) => {
  cy.get(where).find(field).should('have.attr', 'placeholder')
  cy.get(where)
    .find(field)
    .invoke('attr', 'placeholder')
    .should('contain', description) //sprawdzenie placeholdera 'Username'
})

Cypress.Commands.add('fillInCheckoutForm', (firstName, lastName, postCode) => {
  cy.url().should('contain', '/checkout-step-one.html')
  cy.get('.checkout_info').find('#first-name').type(firstName)
  cy.get('.checkout_info').find('#last-name').type(lastName)
  cy.get('.checkout_info').find('#postal-code').type(postCode)
  cy.get('#continue').should('be.visible').click()
})

Cypress.Commands.add('resetAppState', (log, pass) => {
  cy.myLoginSwagStore(log, pass)
  cy.get('#react-burger-menu-btn').should('be.visible').click()
  cy.get('.bm-item-list').contains('Reset App State').click()
  cy.get('.shopping_cart_link').should('be.empty')
  cy.get('.bm-item-list').contains('Logout').click()
})

Cypress.Commands.add('ifMenuOptionAbout', (whichPage) => {
  if (whichPage != 'Complete') {
    cy.get('.shopping_cart_link') //!!!strona Complete - bez sprawdzania koszyka
      .should('not.be.empty')
      .children()
      .should('have.text', 6) //spawdza cyfre w ikonie koszyka
  }
  if (whichPage == 'Cart' || whichPage == 'checkoutOverview') {
    //!!!strony Cart i checkoutOverview - sprawdza ".cart_list" czy sie dodalo w poprzednim kroku
    cy.get('.cart_list').children().should('have.length', 8)
  }
  cy.get('.bm-item-list').contains('About').should('have.attr', 'href') //sprawdza link dla opcji 'About'
  cy.get('.bm-item-list')
    .contains('About')
    .invoke('attr', 'href')
    .should('contain', 'https://saucelabs.com/')

  if (whichPage == 'Inventory') {
    cy.get('.bm-cross-button').should('be.visible').click() //!!!strona Inventory- zamknij burger menu
  }
})

Cypress.Commands.add('checkCurrentMenuOption', (option) => {
  cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
  cy.get('.bm-item-list').should('be.visible') //menu musi byc widoczne
  cy.get('.bm-item-list').contains(option).should('have.text', option) //czy zgodne z opisem
})

Cypress.Commands.add(
  'checkMenuOptionActionResult',
  (whichPage, option, result) => {
    cy.get('.bm-item-list').contains(option).click() //klika w aktualna opcje zeby sprawdzic przekierowanie
    cy.url().should('contain', result) //czy dziala przekierowanie ?
    if (whichPage != 'Complete') {
      //dla wszystkich stron oprocz 'checkoutComplete'
      if (option == 'All Items') {
        //tylko dla opcji 'All Items'
        cy.addEachProductToCart() //w pierwszym kroku dodaj wszystkie produkty do koszyka
        if (whichPage == 'Inventory') {
          //tylko dla strony 'Inventory'
          cy.get('.bm-cross-button').should('be.visible').click() //zamknij burger menu
          cy.get('.bm-item-list').should('not.be.visible')
        }
      }
    }
  }
)

Cypress.Commands.add('doIfMenuOptionIs', (whichPage, option, user, pass) => {
  //inventory //cart //checkout your info // overview //
  if (option == 'All Items') {
    cy.myLoginSwagStore(user, pass) //loguj
  }
  if (option == 'Reset App State') {
    // po poprzednim kroku 'Logout'
    cy.myLoginSwagStore(user, pass) //loguj
    if (whichPage == 'Complete') {
      cy.checkIfAddToCartButtonReset('Add to cart', 0) //czy pamieta stan koszyka i buttonow po 'Logout'
    } else {
      cy.checkIfAddToCartButtonReset('Remove', 6) //czy pamieta stan koszyka i buttonow po 'Logout'
    }
  }
  if (option == 'Logout') {
    cy.visit('/inventory.html')
  } //tylko opja 'Logout' tego wymaga
})

Cypress.Commands.add('checkAfterMenuLogout', (whichPage) => {
  cy.get('.shopping_cart_link')
    .should('not.be.empty')
    .children()
    .should('have.text', 6)
  if (whichPage == 'Cart' || whichPage == 'checkoutOverview') {
    cy.get('.cart_list').children().should('have.length', 8)
    cy.fixture('storeArticles').then((products) => {
      //opisy produktow
      products.forEach((product) => {
        cy.checkCartProductDesc(product)
      })
    })
  }
})

Cypress.Commands.add('closeMenu', () => {
  //sprawdzenie czy dziala button 'X' zamykajacy menu
  cy.get('.bm-cross-button').should('be.visible').click()
  cy.get('.bm-item-list').should('not.be.visible')
})

Cypress.Commands.add('checkAfterResetApp', (whichPage) => {
  if (whichPage == 'checkoutYourInfo') {
    // yourInfo
    cy.get('.shopping_cart_link').should('be.empty')
    cy.get('#cancel').should('be.visible').click() //powrot do '/cart.html' -> tylk
  }

  cy.get('.shopping_cart_link').should('be.empty') //spawdza koszyk w '/cart.html'
  cy.get('.cart_list').children().should('have.length', 2) //spawdza '.cart_list' czy usuniete //cart

  cy.visit('/inventory.html')
  cy.checkIfAddToCartButtonReset('Add to cart', 0) //inventory //wszytskie strony
})

Cypress.Commands.add('moveTo', (whichPage, firstName, surName, postCode) => {
  cy.get('.shopping_cart_link').should('be.visible').click() //przejdz do koszyka
  cy.url().should('contain', '/cart.html')
  cy.get('#checkout').should('be.visible').click() //przejdz do checkout-step-one.html
  cy.url().should('contain', '/checkout-step-one.html')

  if (whichPage != 'checkoutYourInfo') {
    cy.fillInCheckoutForm(firstName, surName, postCode) //zrob checkout i przejdz do checkout:Overview
    cy.url().should('contain', '/checkout-step-two.html')
    if (whichPage == 'Complete') {
      cy.get('#finish').should('be.visible').click() //przejdz do 'checkout: Complete!'
      cy.url().should('contain', '/checkout-complete.html')
    }
  }
})
