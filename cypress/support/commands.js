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

Cypress.Commands.add("myLoginSwagStore", (user, pass) => {
    cy.visit("/");
    cy.url().should("include", "SwagLabs"); //sprawdzenie url
    cy.get('[data-test="username"]').type(user);
    cy.get('[data-test="password"]').type(pass);
    cy.get('[data-test="login-button"]').click();
    //cy.url().should('include', 'inventory.html')
});

Cypress.Commands.add("checkProductsPricesSorting", (sortingOption) => {
    cy.get(".inventory_list")
        .should("be.visible")
        .find(".inventory_item_price")
        .map("innerText")
        .mapInvoke("slice", 1)
        .map(Number)
        .should(sortingOption); //sprawdza czy ceny posortowane w zaleznosci od 'sortingOption'
});

Cypress.Commands.add("checkProductsNamesSorting", (sortingOption) => {
    cy.get(".inventory_list")
        .should("be.visible")
        .find(".inventory_item_name")
        .map("innerText")
        .should(sortingOption);
    //sprawdza czy nazwy posortowane w zaleznosci od 'sortingOption'
});

Cypress.Commands.add("createSession", (log, pass) => {
    cy.session("Session - logging to Swag Store", () => {
        //utrzymanie sesji

        cy.myLoginSwagStore(log, pass);
        cy.url().should("contain", "/inventory.html");
    });
});

Cypress.Commands.add("addOneProductToCart", (whichProduct, qtyInCart) => {
    cy.url().should("contain", "/inventory.html"); //czy jest na '/inventory.html'
    cy.get(".inventory_list")
        .contains(whichProduct)
        .parent()
        .siblings()
        .children()
        .eq(1)
        .should("contain", "Add to cart")
        .click(); //dodaj do koszyka
    cy.get(".shopping_cart_link")
        .should("not.be.empty")
        .children()
        .should("have.text", qtyInCart); //sprawdz ilosc productow w koszyku
});

Cypress.Commands.add("addEachProductToCart", () => {
    let counter = 0;
    cy.url().should("contain", "/inventory.html"); //czy jest na '/inventory.html'
    cy.get(".shopping_cart_link").should("be.empty"); //czy koszyk jest pusty na starcie

    cy.fixture("storeArticles").then((products) => {
        products.forEach((product) => {
            cy.get(".inventory_list")
                .contains(product.article)
                .parent()
                .siblings()
                .children()
                .eq(1)
                .should("contain", "Add to cart")
                .click(); //dodaj do koszyka
            counter = counter + 1;
            cy.get(".shopping_cart_link")
                .should("not.be.empty")
                .children()
                .should("have.text", counter); // ile w koszyku
        });
    });
});

Cypress.Commands.add("removeOneProductFromCart", (whichProduct, qtyInCart) => {
    cy.get(".inventory_list")
        .contains(whichProduct)
        .parent()
        .siblings()
        .children()
        .eq(1)
        .should("contain", "Remove")
        .click(); //usun z koszyka
    if (qtyInCart == 0) {
        //jesli koszyk ma byc pusty
        cy.get(".shopping_cart_link").should("be.empty"); //sprawdz ilosc, czy koszyk jest pusty ?
    } else {
        cy.get(".shopping_cart_link")
            .should("not.be.empty")
            .children()
            .should("have.text", qtyInCart);
    } //ile w koszyku?
});

Cypress.Commands.add(
    "checkIfAddToCartButtonReset",
    (buttonStatus, qtyInCart) => {
        //sprawdza stan na '/inventory.html' po 'Reset App State'

        cy.url().should("contain", "/inventory.html"); //czy jest na '/inventory.html'
        if (qtyInCart == 0) {
            cy.get(".shopping_cart_link").should("be.empty");
        } //czy koszyk jest pusty na starcie
        else {
            cy.get(".shopping_cart_link")
                .should("not.be.empty")
                .children()
                .should("have.text", qtyInCart);
        }

        cy.fixture("storeArticles").then((products) => {
            //bierze dane z json'a z descriptionem artukulow/productow

            products.forEach((product) => {
                //sprawdza kolejno products czy maja zresetowany button 'Add to cart'

                cy.get(".inventory_list")
                    .contains(product.article)
                    .parent()
                    .siblings()
                    .children()
                    .eq(1)
                    .map("innerText")
                    .then((buttonDesc) => {
                        if (buttonDesc != buttonStatus.toUpperCase()) {
                            //jesli button w innym stanie niz podany w 'buttonStatus'

                            cy.log(`----- ERROR!!! ----  
                         Button \'Add to cart\' for below product: 
                         '${product.article}' failed to reset`);
                        }
                    });
                cy.get(".inventory_list")
                    .contains(product.article)
                    .parent()
                    .siblings()
                    .children()
                    .eq(1)
                    .should("contain", buttonStatus); //...buton przy kazdym produkcie ma byc zresetowany do stanu 'Add to cart'
            });
        });
    }
);

Cypress.Commands.add("checkPageReload", (menuOption) => {
    cy.window().then((w) => (w.beforeReload = true));
    cy.window().should("have.prop", "beforeReload", true); // initially the new property is there
    cy.get(".bm-item-list").contains(menuOption).click(); //reload
    cy.window().should("not.have.prop", "beforeReload"); // after reload the property should be gone
});

Cypress.Commands.add("checkInventoryProductDesc", (product) => {
    //testowanie descriptionow i cen na invemtory

    cy.get(".inventory_list")
        .contains("div", product.article)
        .should("contain", product.article);
    cy.get(".inventory_list")
        .contains("div", product.article)
        .parent("a")
        .siblings()
        .should("contain", product.articleDescription);
    cy.get(".inventory_list")
        .contains(product.article)
        .parent()
        .siblings()
        .children()
        .eq(0)
        .should("contain", product.price);
});

Cypress.Commands.add("checkCartProductDesc", (product) => {
    //testowanie descriptionow ilosci i cen w koszyku

    cy.get(".cart_list")
        .contains("div", product.article)
        .should("contain", product.article);
    cy.get(".cart_list")
        .contains("div", product.article)
        .parent()
        .parent()
        .siblings()
        .should("have.text", 1);
    cy.get(".cart_list")
        .contains("div", product.article)
        .parent()
        .siblings()
        .eq(0)
        .should("contain", product.articleDescription);
    cy.get(".cart_list")
        .contains("div", product.article)
        .parent()
        .siblings()
        .eq(1)
        .children()
        .eq(0)
        .should("contain", product.price);
});

Cypress.Commands.add("checkLink", (whichMedia, link) => {
    cy.get(".footer")
        .find(whichMedia)
        .should("be.visible")
        .children()
        .should("have.attr", "href");
    cy.get(".footer")
        .find(whichMedia)
        .children()
        .invoke("attr", "href")
        .should("contain", link);
});

Cypress.Commands.add("checkFooter", () => {
    cy.get(".footer").find(".footer_robot").should("be.visible");
    cy.get(".footer")
        .find(".footer_copy")
        .should(
            "contain",
            " Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy"
        );
    //sprawdz linki
    cy.checkLink(".social_twitter", "https://twitter.com/saucelabs");
    cy.checkLink(".social_facebook", "https://www.facebook.com/saucelabs");
    cy.checkLink(
        ".social_linkedin",
        "https://www.linkedin.com/company/sauce-labs/"
    );
});

Cypress.Commands.add("checkHeader", (title) => {
    cy.get(".app_logo").should("be.visible");
    cy.get(".header_secondary_container")
        .find(".title")
        .should("be.visible")
        .should("have.text", title);
});

Cypress.Commands.add("checkPlaceholder", (where, field, description) => {
    cy.get(where).find(field).should("have.attr", "placeholder");
    cy.get(where)
        .find(field)
        .invoke("attr", "placeholder")
        .should("contain", description); //sprawdzenie placeholdera 'Username'
});
