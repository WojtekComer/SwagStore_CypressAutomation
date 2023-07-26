/// <reference types ="Cypress"/>

import articles from "../fixtures/storeArticles.json";
import burgerMenuItems from "../fixtures/burgerMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");

describe("\n3. 'YOUR CART' PAGE TEST\n", () => {
    it(`Test 1/1 - Checking empty cart.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.url().should("contain", "/inventory.html");
        cy.get(".shopping_cart_link").should("be.empty").click(); // czy koszyk jest pusty na starcie ?

        cy.url().should("contain", "/cart.html");
        cy.get(".shopping_cart_link").should("be.empty");
        cy.checkHeader("Your Cart");
        cy.checkFooter();
        cy.get(".cart_quantity_label").should("have.text", "QTY");
        cy.get(".cart_desc_label").should("have.text", "DESCRIPTION");

        cy.get(".cart_list").children().should("have.length", 2); //brak productow ('.cart_item') w koszyku

        cy.get("#checkout").should("be.visible");
        cy.get("#continue-shopping").should("be.visible").click();
        cy.url().should("contain", "/inventory.html");
    });

    it.each(articles)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingCart"),
        (singleArticle) => {
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.addOneProductToCart(singleArticle.article, 1); //dodaj product
            cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka

            cy.url().should("contain", "/cart.html");
            cy.get(".shopping_cart_link")
                .should("not.be.empty")
                .children()
                .should("have.text", 1);
            cy.get(".cart_list").children().should("have.length", 3); // -> (2 zawsze) + 1 = jest 1 product '.cart_item' w koszyku

            cy.checkCartProductDesc(singleArticle); //testowanie opisow, ilosci i cen w koszyku

            cy.get(".cart_list")
                .contains("div", singleArticle.article)
                .parent()
                .siblings()
                .eq(1)
                .children()
                .eq(1)
                .should("contain", "Remove")
                .click(); //usun z koszyka
            cy.get(".cart_list")
                .children()
                .should("have.length", 3)
                .eq(2)
                .should("have.class", "removed_cart_item");
            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory

            cy.url().should("contain", "/inventory.html");
            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.get(".inventory_list")
                .contains(singleArticle.article)
                .parent()
                .siblings()
                .children()
                .eq(1)
                .should("contain", "Add to cart"); //button add to cart ma byc zresetowany
        }
    );

    it(`Test 1/1 - Add / Remove all produts in cart.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.addEachProductToCart(); //dodaj wszystkie
        cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka

        cy.url().should("contain", "/cart.html");
        cy.get(".shopping_cart_link")
            .should("not.be.empty")
            .children()
            .should("have.text", 6);
        cy.get(".cart_list").children().should("have.length", 8); // -> (2 zawsze) + 6 = jest 6 productow '.cart_item' w koszyku

        let counter = 0;
        cy.fixture("storeArticles").then((products) => {
            products.forEach((product) => {
                cy.checkCartProductDesc(product); //testowanie opisow, ilosci i cen w koszyku
                cy.get(".cart_list")
                    .contains("div", product.article)
                    .parent()
                    .siblings()
                    .eq(1)
                    .children()
                    .eq(1)
                    .should("contain", "Remove")
                    .click(); //usun z koszyka
                cy.get(".cart_list")
                    .children()
                    .should("have.length", 8)
                    .eq(2 + counter)
                    .should("have.class", "removed_cart_item");
                counter = counter + 1;
                if (counter == 6) {
                    cy.get(".shopping_cart_link").should("be.empty");
                } else {
                    cy.get(".shopping_cart_link")
                        .should("not.be.empty")
                        .children()
                        .should("have.text", 6 - counter);
                }
            });
        });

        cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory
        cy.checkIfAddToCartButtonReset("Add to cart", 0); //czy 'usun z koszyka' ma efekt na buttony w '/inventory.html'
    });
});

describe(
    "\n3.1 'YOUR CART' PAGE - BURGER MENU TEST\n",
    { testIsolation: false },
    () => {
        it.each(burgerMenuItems)(
            (z, l, t) =>
                myClassTestDescAndDate.testDescription(
                    z,
                    l,
                    t,
                    "testingBurgerMenu"
                ),
            (menu) => {
                if (menu.menuItem == "All Items") {
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                }
                if (menu.menuItem == "Reset App State") {
                    // po poprzednim kroku 'Logout'
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                    cy.checkIfAddToCartButtonReset("Remove", 6); //czy pamieta stan koszyka i buttonow po poprzednim kroku 'Logout'
                }
                if (menu.menuItem == "Logout") {
                    cy.visit("/inventory.html");
                } //tylko opja 'Logout' tego wymaga

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");
                cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
                cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .should("have.text", menu.menuItem); //czy zgodne z descriptionem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //sprawdzenie dzialania opcji 'Reset App state'

                        //czy pamieta stan koszyka - '/cart.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.get(".shopping_cart_link")
                            .should("not.be.empty")
                            .children()
                            .should("have.text", 6);
                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 8);
                        cy.fixture("storeArticles").then((products) => {
                            products.forEach((product) => {
                                cy.checkCartProductDesc(product);
                            });
                        });

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem ze nie odswieza
                        //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                        cy.get(".bm-cross-button").should("be.visible").click();
                        cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu

                        cy.get(".shopping_cart_link").should("be.empty");
                        //cy.reload() //dla testu czy usuwa products z koszyka bo jest defekt i nie odswieza strony po 'Reset App State'
                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 2); //czy usunal products z koszyka

                        cy.get("#continue-shopping")
                            .should("be.visible")
                            .click(); //powrot do inventory
                        cy.checkIfAddToCartButtonReset("Add to cart", 0);
                    } else {
                        cy.get(".bm-item-list").contains(menu.menuItem).click(); //klika w aktualna opcje zeby sprawdzic przekierowanie
                        cy.url().should("contain", menu.action); //czy dziala przekierowanie ?
                        if (menu.menuItem == "All Items") {
                            cy.addEachProductToCart(); //w pierwszym kroku dodaj wszystkie products do koszyka
                        }
                    }
                } else {
                    //jesli opcja: 'About'
                    cy.get(".shopping_cart_link")
                        .should("not.be.empty")
                        .children()
                        .should("have.text", 6); //spawdza stan koszyka na '/cart.html'
                    cy.get(".cart_list").children().should("have.length", 8);
                    cy.get(".bm-item-list")
                        .contains(menu.menuItem)
                        .should("have.attr", "href"); //sprawdza link dla opcji 'About'
                    cy.get(".bm-item-list")
                        .contains(menu.menuItem)
                        .invoke("attr", "href")
                        .should("contain", "https://saucelabs.com/");
                }
            }
        );
    }
);
