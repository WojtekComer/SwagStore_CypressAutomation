/// <reference types ="Cypress"/>

import articles from "../fixtures/storeArticles.json";
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
